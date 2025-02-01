import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/recatWeek3hw/",
  // 填入你的 GitHub repository 名稱
  plugins: [react()],
  build: {
    outDir: 'dist', // 確保輸出資料夾是 dist
  },
})
