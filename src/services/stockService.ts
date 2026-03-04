export async function fetchStockData(symbol: string, apiKey: string) {
  try {
    // Fetch Quote
    const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    const quoteData = await quoteRes.json();

    // Fetch Profile
    const profileRes = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`);
    const profileData = await profileRes.json();

    if (!quoteData.c) {
      throw new Error("Symbol not found");
    }

    return { quote: quoteData, profile: profileData };
  } catch (error) {
    console.error("Stock Service Error:", error);
    throw error;
  }
}
