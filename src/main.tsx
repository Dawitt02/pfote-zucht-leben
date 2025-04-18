
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import AppWrapper from './components/AppWrapper'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>,
)
