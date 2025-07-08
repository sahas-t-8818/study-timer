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
  // Lift timer state up
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);

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
        return <Timer 
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          time={time}
          setTime={setTime}
        />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Timer 
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          time={time}
          setTime={setTime}
        />;
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
        {/* Sidebar is hidden when timer is running and not paused */}
        {!(isRunning && !isPaused) && (
          <Sidebar 
            ref={sidebarRef}
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            hideToggle={isRunning && !isPaused}
          />
        )}
        <main className={styles['main-content']}>
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
