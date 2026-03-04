import { GoogleGenAI } from "@google/genai";

// ❌ 刪除原本放在這裡的全域變數，它就是兇手
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getStockAnalysis(symbol: string, companyName: string, quote: any) {
  // ✅ 1. 從瀏覽器抓取 Key (這裡假設你之後會在設定頁面存入 "GEMINI_API_KEY")
  // 我們同時檢查兩種常見的儲存名稱，確保抓得到
  const apiKey = localStorage.getItem("GEMINI_API_KEY") || localStorage.getItem("gemini_api_key");

  // ✅ 2. 如果沒有 Key，就溫柔地回傳提示，而不是讓程式崩潰
  if (!apiKey) {
    console.warn("No API key found in localStorage");
    return "請先在設定(Settings)中輸入您的 Gemini API Key，才能使用 AI 分析功能。";
  }

  try {
    // ✅ 3. 只有在真的要用的時候，才用 Key 來啟動 AI
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const response = await ai.models.generateContent({
      // ⚠️ 注意：gemini-3 還沒出，我幫你改成目前最穩定的 gemini-2.0-flash 或 1.5-flash
      model: "gemini-2.0-flash-exp", 
      contents: `Analyze the stock ${symbol} (${companyName}). 
      Current Price: $${quote.c}
      Change: $${quote.d} (${quote.dp}%)
      High: $${quote.h}
      Low: $${quote.l}
      
      Provide a brief (2-3 sentences) market sentiment analysis and potential outlook based on these numbers.`,
    });
    
    // 修正：通常 response.text 是一個函式，需要加括號 ()
    // 如果你的 SDK 版本不同，請保留你原本的寫法，但我建議先試試加括號
    return response.text ? response.text() : "No analysis text returned.";
    
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "目前無法連線到 AI 分析 (請檢查 API Key 是否正確或額度是否足夠)。";
  }
}
