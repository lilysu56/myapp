import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  // 設定為相對路徑，解決白屏問題
  base: './',
  
  resolve: {
    alias: {
      // 關鍵修改：讓 '@' 代表專案的「根目錄」，而不是 src
      // 這樣你的程式碼寫 @/src/lib/utils 才會變成 正確的 src/lib/utils
      '@': path.resolve(__dirname, './'),
    }
  }
})
