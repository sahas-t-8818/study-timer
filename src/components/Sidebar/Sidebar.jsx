import React, { forwardRef, useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Sidebar.module.css';

const Sidebar = forwardRef(({ activeTab, setActiveTab, hideToggle }, ref) => {
  const { theme, toggleTheme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add(styles['no-scroll']);
    } else {
      document.body.classList.remove(styles['no-scroll']);
    }
    return () => { document.body.classList.remove(styles['no-scroll']); };
  }, [mobileOpen]);

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
    if (isMobile) setMobileOpen(false);
  };

  // Hamburger button for mobile
  const Hamburger = () => (
    !hideToggle && (
      <button
        className={mobileOpen ? `${styles.hamburger} ${styles.hamburgerOpen}` : styles.hamburger}
        aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ position: 'fixed', top: 20, left: 20, zIndex: 2200 }}
      >
        <div className={styles.hamburgerInner}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
      </button>
    )
  );

  // Mobile sidebar markup
  const MobileSidebar = () => (
    <>
      <div className={mobileOpen ? styles['sidebar-overlay'] : `${styles['sidebar-overlay']} ${styles['hidden']}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={mobileOpen ? `${styles.mobileSidebar} ${styles.mobileSidebarOpen}` : styles.mobileSidebar}>
        <button className={styles['sidebar-close']} onClick={() => setMobileOpen(false)} aria-label="Close sidebar">×</button>
        <div className={styles['sidebar-header']}>
          <h2 className={styles['sidebar-title']}>Study Timer</h2>
        </div>
        <nav className={styles['sidebar-nav']} style={{flex: '0 0 auto'}}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles['nav-item']} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleNavClick(item.id)}
              type="button"
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
            type="button"
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
              type="button"
            >
              📲 Install App
            </button>
          )}
        </div>
      </aside>
    </>
  );

  // Desktop sidebar markup
  const DesktopSidebar = () => (
    <aside ref={ref} className={styles.floatingSidebar}>
      <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
        <div className={styles['sidebar-header']}>
          <h2 className={styles['sidebar-title']}>Study Timer</h2>
        </div>
        <nav className={styles['sidebar-nav']} style={{flex: '0 0 auto'}}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles['nav-item']} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleNavClick(item.id)}
              type="button"
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
            type="button"
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
              type="button"
            >
              📲 Install App
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Hamburger />
          <MobileSidebar />
        </>
      ) : (
        <DesktopSidebar />
      )}
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 