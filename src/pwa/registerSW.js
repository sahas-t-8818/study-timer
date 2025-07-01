export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/study-timer/service-worker.js'; // for production
      const localSwUrl = '/study-timer/service-worker.js'; // for local dev
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      navigator.serviceWorker
        .register(isLocalhost ? localSwUrl : swUrl)
        .then((reg) => {
          console.log('Service Worker registered:', reg);
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    });
  }
} 