
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Don't need to import Providers here since we're using AppWrapper in each page

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
