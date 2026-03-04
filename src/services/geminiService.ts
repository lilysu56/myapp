import { GoogleGenAI } from "@google/genai";

// ❌ 刪除：千萬不要在外面初始化，因為這時候還沒有 Key
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getStockAnalysis(symbol: string, companyName: string, quote: any) {
  // ✅ 1. 第一步：先從瀏覽器的保險箱 (LocalStorage) 拿出鑰匙
  // 記得：你的設定頁面存的是什麼名字，這裡就要用什麼名字 (通常我們用 GEMINI_API_KEY)
  const apiKey = localStorage.getItem("GEMINI_API_KEY") || localStorage.getItem("gemini_api_key");

  // ✅ 2. 檢查：如果沒有鑰匙，就溫柔地告訴使用者，而不是讓程式崩潰
  if (!apiKey) {
    console.warn("No API key found in localStorage");
    return "請先點擊右上角設定 (Settings) 輸入您的 API Key，才能使用 AI 分析功能。";
  }

  try {
    // ✅ 3. 重頭戲：只有在真的要分析時，才用剛拿到的鑰匙啟動 AI
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const response = await ai.models.generateContent({
      // ⚠️ 建議改用目前穩定且免費的 gemini-2.0-flash 或 gemini-1.5-flash
      model: "gemini-2.0-flash", 
      contents: [
        {
          parts: [
            {
              text: `Analyze the stock ${symbol} (${companyName}). 
              Current Price: $${quote.c}
              Change: $${quote.d} (${quote.dp}%)
              High: $${quote.h}
              Low: $${quote.l}
              
              Provide a brief (2-3 sentences) market sentiment analysis and potential outlook based on these numbers.`
            }
          ]
        }
      ],
    });

    // 取得回應文字
    // 注意：新版 SDK 的 response.text() 是一個函式
    const text = response.text ? response.text() : "No analysis text returned.";
    return text;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "目前無法連線到 AI 分析 (請檢查 API Key 是否正確，或額度是否足夠)。";
  }
}
