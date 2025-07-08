import React, { useState, useEffect, useMemo } from 'react';
import { getSessions, getSessionsByPeriod } from '../../services/dataService';
import { 
  calculateTotalTime, 
  calculateAverageSession, 
  calculateStudyStreak,
  getMostProductiveHours,
  getMostProductiveDays,
  prepareChartData,
  formatDuration
} from '../../utils/timeUtils';
import { getRandomQuote } from '../../data/quotes';
import StudyChart from './StudyChart';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('7d');
  const [quote, setQuote] = useState(getRandomQuote());
  const [loading, setLoading] = useState(true);

  // Load sessions
  useEffect(() => {
    const loadSessions = () => {
      const allSessions = getSessions();
      setSessions(allSessions);
      setLoading(false);
    };

    loadSessions();
    
    // Refresh quote every 5 minutes
    const quoteInterval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 5 * 60 * 1000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Calculate analytics
  const analytics = useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalTime: 0,
        averageSession: 0,
        studyStreak: 0,
        totalSessions: 0,
        productiveHours: [],
        productiveDays: []
      };
    }

    const periodSessions = getSessionsByPeriod(chartPeriod);
    
    return {
      totalTime: calculateTotalTime(sessions),
      averageSession: calculateAverageSession(sessions),
      studyStreak: calculateStudyStreak(sessions),
      totalSessions: sessions.length,
      productiveHours: getMostProductiveHours(sessions),
      productiveDays: getMostProductiveDays(sessions),
      periodSessions
    };
  }, [sessions, chartPeriod]);

  // Chart data
  const chartData = useMemo(() => {
    return prepareChartData(sessions, chartPeriod);
  }, [sessions, chartPeriod]);

  if (loading) {
    return (
      <div className={styles['dashboard-container']}>
        <div className={styles['loading-spinner']}>
          <div className="spinner"></div>
          <p>Loading your study data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['dashboard-container']}>
      {/* Header */}
      <div className={styles['dashboard-header']}>
        <h1 className={styles['dashboard-title']}>Study Dashboard</h1>
        <p className={styles['dashboard-subtitle']}>Track your progress and stay motivated</p>
      </div>

      {/* Motivational Quote */}
      <div className={`${styles['quote-card']} glass-card`}>
        <div className={styles['quote-content']}>
          <p className={styles['quote-text']}>"{quote.text}"</p>
          <p className={styles['quote-author']}>— {quote.author}</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className={styles['analytics-grid']}>
        <div className={`${styles['analytics-card']} glass-card`}>
          <div className={styles['card-icon']}>⏱️</div>
          <div className={styles['card-content']}>
            <h3 className={styles['card-title']}>Total Study Time</h3>
            <p className={styles['card-value']}>{formatDuration(analytics.totalTime)}</p>
          </div>
        </div>

        <div className={`${styles['analytics-card']} glass-card`}>
          <div className={styles['card-icon']}>📊</div>
          <div className={styles['card-content']}>
            <h3 className={styles['card-title']}>Average Session</h3>
            <p className={styles['card-value']}>{formatDuration(analytics.averageSession)}</p>
          </div>
        </div>

        <div className={`${styles['analytics-card']} glass-card`}>
          <div className={styles['card-icon']}>🔥</div>
          <div className={styles['card-content']}>
            <h3 className={styles['card-title']}>Study Streak</h3>
            <p className={styles['card-value']}>{analytics.studyStreak} days</p>
          </div>
        </div>

        <div className={`${styles['analytics-card']} glass-card`}>
          <div className={styles['card-icon']}>📚</div>
          <div className={styles['card-content']}>
            <h3 className={styles['card-title']}>Total Sessions</h3>
            <p className={styles['card-value']}>{analytics.totalSessions}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className={`${styles['chart-section']} glass-card`}>
        <div className={styles['chart-header']}>
          <h2 className={styles['chart-title']}>Study Time Overview</h2>
          <div className={styles['chart-controls']}>
            <button
              className={`${styles['period-btn']} ${chartPeriod === 'today' ? styles.active : ''}`}
              onClick={() => setChartPeriod('today')}
            >
              Today
            </button>
            <button
              className={`${styles['period-btn']} ${chartPeriod === '7d' ? styles.active : ''}`}
              onClick={() => setChartPeriod('7d')}
            >
              7 Days
            </button>
            <button
              className={`${styles['period-btn']} ${chartPeriod === '30d' ? styles.active : ''}`}
              onClick={() => setChartPeriod('30d')}
            >
              30 Days
            </button>
            <button
              className={`${styles['period-btn']} ${chartPeriod === '3m' ? styles.active : ''}`}
              onClick={() => setChartPeriod('3m')}
            >
              3 Months
            </button>
          </div>
        </div>
        <StudyChart data={chartData} period={chartPeriod} />
      </div>

      {/* Productivity Insights */}
      <div className={styles['insights-grid']}>
        {/* Most Productive Hours */}
        <div className={`${styles['insight-card']} glass-card`}>
          <h3 className={styles['insight-title']}>Most Productive Hours</h3>
          {analytics.productiveHours.length > 0 ? (
            <div className={styles['insight-list']}>
              {analytics.productiveHours.map((hour, index) => (
                <div key={hour.hour} className={styles['insight-item']}>
                  <span className={styles['insight-rank']}>#{index + 1}</span>
                  <span className={styles['insight-label']}>{hour.timeString}</span>
                  <span className={styles['insight-value']}>{formatDuration(hour.duration)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles['no-data']}>No data available</p>
          )}
        </div>

        {/* Most Productive Days */}
        <div className={`${styles['insight-card']} glass-card`}>
          <h3 className={styles['insight-title']}>Most Productive Days</h3>
          {analytics.productiveDays.length > 0 ? (
            <div className={styles['insight-list']}>
              {analytics.productiveDays.map((day, index) => (
                <div key={day.day} className={styles['insight-item']}>
                  <span className={styles['insight-rank']}>#{index + 1}</span>
                  <span className={styles['insight-label']}>{day.day}</span>
                  <span className={styles['insight-value']}>{formatDuration(day.duration)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles['no-data']}>No data available</p>
          )}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className={`${styles['sessions-section']} glass-card`}>
        <h2 className={styles['sessions-title']}>Recent Study Sessions</h2>
        {sessions.length > 0 ? (
          <div className={styles['sessions-list']}>
            {sessions.slice(0, 10).map((session) => (
              <div key={session.id} className={styles['session-item']}>
                <div className={styles['session-date']}>
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className={styles['session-duration']}>
                  {formatDuration(session.duration)}
                </div>
                <div className={styles['session-time']}>
                  {new Date(session.startTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles['no-data']}>No study sessions yet. Start your first session!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 