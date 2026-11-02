// Точка входа приложения.
// StrictMode — dev-режим React: он намеренно вызывает эффекты ДВАЖДЫ,
// чтобы показать баги (см. комментарии в App.jsx). В продакшене не влияет.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
