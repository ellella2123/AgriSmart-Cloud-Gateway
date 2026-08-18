import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const originalError = console.error;
console.error = (...args) => {
  const argStr = String(args[0] || '');
  if (
    argStr.includes('ApiNotActivatedMapError') ||
    argStr.includes('getRootNode') ||
    argStr.includes('keys') ||
    argStr.includes('The above error occurred') ||
    argStr.includes('Consider adding an error boundary') ||
    argStr.includes('Google Maps JavaScript API') ||
    argStr.includes('google.maps')
  ) {
    return;
  }
  if (args[0] && args[0].message) {
    const msg = args[0].message;
    if (
      msg.includes('getRootNode') ||
      msg.includes('keys') ||
      msg.includes('ApiNotActivatedMapError') ||
      msg.includes('Google Maps JavaScript API') ||
      msg.includes('google.maps')
    ) {
      return;
    }
  }
  originalError(...args);
};

window.addEventListener('error', (e) => {
  const msg = e.message || String(e.error || '');
  if (
    msg.includes('getRootNode') ||
    msg.includes('keys') ||
    msg.includes('ApiNotActivatedMapError') ||
    msg.includes('Script error.') ||
    msg.includes('Google Maps JavaScript API') ||
    msg.includes('google.maps')
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

window.addEventListener('unhandledrejection', (e) => {
  const msg = (e.reason && e.reason.message) || String(e.reason || '');
  if (
    msg.includes('getRootNode') ||
    msg.includes('keys') ||
    msg.includes('ApiNotActivatedMapError') ||
    msg.includes('Google Maps JavaScript API') ||
    msg.includes('google.maps')
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


