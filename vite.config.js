// Конфигурация Vite. Здесь мы только "подключаем" два плагина:
// 1) react()          — чтобы JSX работал
// 2) tailwindcss()    — чтобы классы Tailwind превращались в CSS
// Больше ничего настраивать не нужно.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Явный host 127.0.0.1 вместо localhost:
  // на некоторых машинах (и в песочницах) localhost резолвится в
  // IPv6 ::1, которого нет, и Vite молча не поднимает сервер.
  // Если у тебя всё работает с localhost — эту секцию можно удалить.
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
