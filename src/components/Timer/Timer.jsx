import React, { useEffect, useCallback, useRef, useState } from 'react';
import { formatTime } from '../../utils/timeUtils';
import { addSession } from '../../services/dataService';
import { getSessions } from '../../services/dataService';
import { prepareChartData } from '../../utils/timeUtils';
import StudyChart from '../Dashboard/StudyChart';
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

const Timer = ({ isRunning, setIsRunning, isPaused, setIsPaused, time, setTime }) => {
  const [startTime, setStartTime] = React.useState(null); // timestamp in ms
  const [elapsed, setElapsed] = React.useState(0); // ms
  const rafRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Animation frame update
  const update = useCallback(() => {
    if (isRunning && !isPaused && startTime) {
      setTime(Math.floor((Date.now() - startTime + elapsed) / 1000));
      rafRef.current = requestAnimationFrame(update);
    }
  }, [isRunning, isPaused, startTime, elapsed, setTime]);

  // Start timer
  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      setStartTime(Date.now());
      setElapsed(0);
    } else if (isPaused) {
      setIsPaused(false);
      setStartTime(Date.now());
    }
  }, [isRunning, isPaused, setIsRunning, setIsPaused]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (isRunning && !isPaused && startTime) {
      setIsPaused(true);
      setElapsed(prevElapsed => prevElapsed + (Date.now() - startTime));
      setStartTime(null);
    }
  }, [isRunning, isPaused, startTime, setIsPaused]);

  // Stop timer and save session
  const stopTimer = useCallback(() => {
    if (isRunning && time > 0) {
      const now = Date.now();
      const totalElapsed = isPaused ? elapsed : (elapsed + (startTime ? now - startTime : 0));
      const session = {
        duration: Math.floor(totalElapsed / 1000),
        startTime: startTime ? startTime : now - totalElapsed,
        endTime: now,
        pauseTime: 0 // not used
      };
      addSession(session);
    }
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setStartTime(null);
    setElapsed(0);
  }, [isRunning, time, startTime, elapsed, isPaused, setIsRunning, setIsPaused, setTime]);

  // Reset timer
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setStartTime(null);
    setElapsed(0);
  }, [setIsRunning, setIsPaused, setTime]);

  // Animation frame effect
  useEffect(() => {
    if (isRunning && !isPaused && startTime) {
      rafRef.current = requestAnimationFrame(update);
      return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  }, [isRunning, isPaused, startTime, update]);

  // On visibilitychange, recalc time if running
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isRunning && !isPaused && startTime) {
        setTime(Math.floor((Date.now() - startTime + elapsed) / 1000));
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isRunning, isPaused, startTime, elapsed, setTime]);

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

  useEffect(() => {
    setSessions(getSessions());
  }, [time, isRunning, isPaused]);

  useEffect(() => {
    setChartData(prepareChartData(sessions, 'today'));
  }, [sessions]);

  return (
    <div className={styles['timer-container']}>
      <div className={`${styles['timer-card']} glass-card`}>
        <div className={styles['timer-display']}>
          <div className={styles['time-display']}>{formatTime(time)}</div>
          <div className={styles['timer-status']}>
            {!isRunning && !isPaused && 'Ready to start'}
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

        {/* Only show timer-actions and timer-shortcuts if not running or paused */}
        {(!isRunning || isPaused) && time > 0 && (
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

        {(!isRunning || isPaused) && (
          <div className={styles['timer-shortcuts']}>
            <p className={styles['shortcuts-text']}>
              <strong>Keyboard Shortcuts:</strong><br />
              <kbd>Space</kbd> - Start/Pause • <kbd>Ctrl+S</kbd> - Stop & Save • <kbd>Ctrl+R</kbd> - Reset
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer; 