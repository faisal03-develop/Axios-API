import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Container } from '@mui/material'
import './index.css'
import App from './App.jsx'
import Header from './components/header/header.jsx'
import Cards from './components/cards/cards.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Container>
        <App />
        <Header />
        <Cards />
    </Container>
  </StrictMode>,
)
