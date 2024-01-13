import React from 'react'
import ReactDOM from 'react-dom/client'
import ModalContainer from 'react-modal-promise'
import { RouterProvider } from 'react-router-dom'
import './normalize.css'
import { router } from './router.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ModalContainer />
  </React.StrictMode>
)
