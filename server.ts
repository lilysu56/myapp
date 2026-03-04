import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy for Finnhub API to avoid CORS and hide API Key
  app.get("/api/stock/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "FINNHUB_API_KEY is not configured" });
    }

    try {
      // Get Quote
      const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
      const quoteData = await quoteRes.json();

      // Get Profile
      const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
      const profileData = await profileRes.json();

      res.json({ quote: quoteData, profile: profileData });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  app.get("/api/market-indices", async (req, res) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing API Key" });

    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]; // Example major stocks as proxy for indices in free tier
    try {
      const results = await Promise.all(
        symbols.map(async (s) => {
          const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${apiKey}`);
          return { symbol: s, ...(await r.json()) };
        })
      );
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
