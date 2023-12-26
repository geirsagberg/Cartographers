import React from 'react'
import ReactDOM from 'react-dom/client'
import ModalContainer from 'react-modal-promise'
import App from './App.tsx'
import './normalize.css'

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => 'Are you sure you want to leave?'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ModalContainer />
  </React.StrictMode>
)
