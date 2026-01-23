import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { Provider } from "react-redux"
import store from "./store/store.ts"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  registerSW()
}
