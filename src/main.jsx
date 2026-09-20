import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {browserRouter as Router} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <browserRouter basename= {import.meta.env.BASE_URL}>
      <App />
    </browserRouter>
  </StrictMode>,
);
