import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  base: './', 
  plugins: [
    react(),
    tailwindcss(), // 啟動新版 Tailwind
  ],
  resolve: {
    alias: {
      // 關鍵修改：讓 @ 代表「根目錄」，而不是 src
      // 這樣你的程式碼寫 @/src/lib/utils 就會正確變成 根目錄/src/lib/utils
      "@": path.resolve(__dirname, "./"), 
    },
  },
})
