import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/make_a_curry/', // これを追加！リポジトリ名と同じにする必要があります
})
