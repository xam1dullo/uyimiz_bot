import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize theme from localStorage before render to prevent flicker
try {
  const savedTheme = localStorage.getItem('uy_theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('theme-light');
  }
} catch (e) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
