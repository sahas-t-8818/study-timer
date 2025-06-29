// Format seconds to HH:MM:SS
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format seconds to human readable format
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

// Get date string in YYYY-MM-DD format
export const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

// Get day name from date
export const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Calculate total study time from sessions
export const calculateTotalTime = (sessions) => {
  return sessions.reduce((total, session) => total + (session.duration || 0), 0);
};

// Calculate average session length
export const calculateAverageSession = (sessions) => {
  if (sessions.length === 0) return 0;
  const totalTime = calculateTotalTime(sessions);
  return Math.round(totalTime / sessions.length);
};

// Calculate study streak (consecutive days)
export const calculateStudyStreak = (sessions) => {
  if (sessions.length === 0) return 0;
  
  const today = new Date();
  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (let i = 0; i < dates.length; i++) {
    const sessionDate = new Date(dates[i]);
    const diffTime = currentDate - sessionDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }
  
  return streak;
};

// Get most productive hours
export const getMostProductiveHours = (sessions) => {
  const hourCounts = {};
  
  sessions.forEach(session => {
    if (session.startTime) {
      const hour = new Date(session.startTime).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + session.duration;
    }
  });
  
  return Object.entries(hourCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([hour, duration]) => ({
      hour: parseInt(hour),
      duration,
      timeString: `${hour}:00`
    }));
};

// Get most productive days
export const getMostProductiveDays = (sessions) => {
  const dayCounts = {};
  
  sessions.forEach(session => {
    const day = getDayName(session.date);
    dayCounts[day] = (dayCounts[day] || 0) + session.duration;
  });
  
  return Object.entries(dayCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([day, duration]) => ({
      day,
      duration
    }));
};

// Prepare chart data for different periods
export const prepareChartData = (sessions, period = '7d') => {
  const now = new Date();
  const data = [];
  
  let days;
  switch (period) {
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    case '3m':
      days = 90;
      break;
    default:
      days = 7;
  }
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateString = getDateString(date);
    
    const daySessions = sessions.filter(s => s.date === dateString);
    const totalTime = calculateTotalTime(daySessions);
    
    data.push({
      date: dateString,
      day: getDayName(dateString),
      time: totalTime,
      formattedTime: formatDuration(totalTime)
    });
  }
  
  return data;
}; 