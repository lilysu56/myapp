import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // 這是為了讓你的 App 在 GitHub Pages 也能正確讀取資源
  base: '/myapp/',
  
  // 這裡是重點：告訴 Vite 當它看到 '@' 時，代表從「專案根目錄」開始找
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  }
})
