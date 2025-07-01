import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar/Sidebar';
import Timer from './components/Timer/Timer';
import Dashboard from './components/Dashboard/Dashboard';
import styles from './App.module.css';

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const sidebarRef = useRef(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <Timer />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Timer />;
    }
  };

  return (
    <ThemeProvider>
      <div className={styles.app}>
        {isOffline && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: '#ffb347',
            color: '#222',
            textAlign: 'center',
            padding: '0.5rem',
            zIndex: 1000,
            fontWeight: 500,
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <span role="status" aria-live="polite">⚠️ Offline: Some features may be unavailable.</span>
          </div>
        )}
        <Sidebar 
          ref={sidebarRef}
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
        <main className={styles['main-content']}>
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
