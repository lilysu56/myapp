import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getStockAnalysis(symbol: string, companyName: string, quote: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the stock ${symbol} (${companyName}). 
      Current Price: $${quote.c}
      Change: $${quote.d} (${quote.dp}%)
      High: $${quote.h}
      Low: $${quote.l}
      
      Provide a brief (2-3 sentences) market sentiment analysis and potential outlook based on these numbers.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate AI analysis at this time.";
  }
}
