import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar/Sidebar';
import Timer from './components/Timer/Timer';
import Dashboard from './components/Dashboard/Dashboard';
import styles from './App.module.css';

function App() {
  const [activeTab, setActiveTab] = useState('timer');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [sidebarOpen]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

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
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          closeSidebar={closeSidebar}
        />
        <main className={`${styles['main-content']} ${sidebarOpen ? styles['sidebar-open'] : ''}`}>
          <button 
            className={`${styles['sidebar-toggle']} ${sidebarOpen ? styles['toggle-hidden'] : ''}`} 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          {renderContent()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
