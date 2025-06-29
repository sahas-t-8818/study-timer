import React, { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime } from '../../utils/timeUtils';
import { addSession } from '../../services/dataService';
import styles from './Timer.module.css';

// SVG Icons as components
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
    <path d="M9 6l10 6-10 6V6z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const StopIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
);

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionPauseTime, setSessionPauseTime] = useState(0);
  const intervalRef = useRef(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Start timer
  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      setSessionStartTime(Date.now());
      setSessionPauseTime(0);
    } else if (isPaused) {
      setIsPaused(false);
      setSessionPauseTime(prev => prev + (Date.now() - sessionStartTime));
    }
  }, [isRunning, isPaused, sessionStartTime]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
    }
  }, [isRunning, isPaused]);

  // Stop timer and save session
  const stopTimer = useCallback(() => {
    if (isRunning && time > 0) {
      const session = {
        duration: time,
        startTime: sessionStartTime,
        endTime: Date.now(),
        pauseTime: sessionPauseTime
      };
      
      addSession(session);
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setSessionStartTime(null);
    setSessionPauseTime(0);
  }, [isRunning, time, sessionStartTime, sessionPauseTime]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setSessionStartTime(null);
    setSessionPauseTime(0);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning) {
          startTimer();
        } else if (isPaused) {
          startTimer();
        } else {
          pauseTimer();
        }
      } else if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (isRunning) {
          stopTimer();
        }
      } else if (e.code === 'KeyR' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, isPaused, startTimer, pauseTimer, stopTimer, resetTimer]);

  return (
    <div className={styles['timer-container']}>
      <div className={`${styles['timer-card']} glass-card`}>
        <div className={styles['timer-display']}>
          <div className={styles['time-display']}>{formatTime(time)}</div>
          <div className={styles['timer-status']}>
            {!isRunning && !isPaused && 'Ready to start'}
            {isRunning && !isPaused && 'Studying...'}
            {isPaused && 'Paused'}
          </div>
        </div>

        <div className={styles['timer-controls']}>
          {!isRunning ? (
            <button 
              className={`btn btn-large ${styles['start-btn']}`} 
              onClick={startTimer}
              aria-label="Start timer"
            >
              <div className={styles['button-content']}>
                <PlayIcon /> Start
              </div>
            </button>
          ) : isPaused ? (
            <div className={styles['control-group']}>
              <button 
                className={`btn btn-large ${styles['resume-btn']}`} 
                onClick={startTimer}
                aria-label="Resume timer"
              >
                <div className={styles['button-content']}>
                  <PlayIcon /> Resume
                </div>
              </button>
              <button 
                className="btn btn-secondary stop-btn" 
                onClick={stopTimer}
                aria-label="Stop and save session"
              >
                <StopIcon /> Stop & Save
              </button>
            </div>
          ) : (
            <div className={styles['control-group']}>
              <button 
                className="btn btn-secondary pause-btn" 
                onClick={pauseTimer}
                aria-label="Pause timer"
              >
                <PauseIcon /> Pause
              </button>
              <button 
                className="btn btn-secondary stop-btn" 
                onClick={stopTimer}
                aria-label="Stop and save session"
              >
                <StopIcon /> Stop & Save
              </button>
            </div>
          )}
        </div>

        {time > 0 && (
          <div className={styles['timer-actions']}>
            <button 
              className="btn btn-secondary reset-btn" 
              onClick={resetTimer}
              aria-label="Reset timer"
            >
              <ResetIcon /> Reset
            </button>
          </div>
        )}

        <div className={styles['timer-shortcuts']}>
          <p className={styles['shortcuts-text']}>
            <strong>Keyboard Shortcuts:</strong><br />
            <kbd>Space</kbd> - Start/Pause • <kbd>Ctrl+S</kbd> - Stop & Save • <kbd>Ctrl+R</kbd> - Reset
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timer; 