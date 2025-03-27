import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GlobalStyles } from './styles/globalStyles.ts'
import { AuthProvider } from './authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyles/>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
