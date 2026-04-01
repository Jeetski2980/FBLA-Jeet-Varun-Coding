import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx'; // Root app component
import './index.css';

if ('serviceWorker' in navigator) { // Register offline support
  window.addEventListener('load', () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
      return;
    }

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    });
  });
}

createRoot(document.getElementById('root')).render( // Mount the app
  <StrictMode>
    <App />
  </StrictMode>,
);
