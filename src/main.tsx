import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.scss'

// To use MUI's default font, Roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
//-----------------------------------

import theme from './theme.tsx';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
