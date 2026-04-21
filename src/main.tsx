import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // ここがAppを読み込んでいるか
import './index.css' // ここでCSSを読み込んでいるか

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)