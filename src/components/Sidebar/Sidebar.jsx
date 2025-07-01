import React, { forwardRef, useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Sidebar.module.css';

const Sidebar = forwardRef(({ activeTab, setActiveTab, isOpen, toggleSidebar, closeSidebar }, ref) => {
  const { theme, toggleTheme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    }
  };

  const navItems = [
    { id: 'timer', label: 'Timer', icon: '⏱️' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className={styles['sidebar-overlay']} 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside ref={ref} className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles['sidebar-header']}>
          <h2 className={styles['sidebar-title']}>Study Timer</h2>
          <button 
            className={styles['sidebar-close']}
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <nav className={styles['sidebar-nav']}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles['nav-item']} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className={styles['nav-icon']}>{item.icon}</span>
              <span className={styles['nav-label']}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles['sidebar-footer']}>
          <button
            className={styles['theme-toggle']}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
            <span className={styles['theme-label']}>
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
          {showInstall && (
            <button
              className={styles['install-btn']}
              onClick={handleInstallClick}
              aria-label="Install Study Timer as an app"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              📲 Install App
            </button>
          )}
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 