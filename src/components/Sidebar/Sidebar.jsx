import React, { forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Sidebar.module.css';

const Sidebar = forwardRef(({ activeTab, setActiveTab, isOpen, toggleSidebar, closeSidebar }, ref) => {
  const { theme, toggleTheme } = useTheme();

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
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 