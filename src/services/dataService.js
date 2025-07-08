const STORAGE_KEY = 'studyTimer_data';

// Initialize default data structure
const getDefaultData = () => ({
  sessions: [],
  settings: {
    theme: 'light'
  }
});

// Load data from localStorage
export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all required fields exist
      return {
        ...getDefaultData(),
        ...parsed,
        sessions: parsed.sessions || []
      };
    }
    return getDefaultData();
  } catch (error) {
    console.error('Error loading data:', error);
    return getDefaultData();
  }
};

// Save data to localStorage
export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Session management
export const addSession = (session) => {
  const data = loadData();
  // Use local date from session.startTime
  let localDateString = '';
  if (session.startTime) {
    const localDate = new Date(session.startTime);
    localDateString = localDate.getFullYear() + '-' + String(localDate.getMonth() + 1).padStart(2, '0') + '-' + String(localDate.getDate()).padStart(2, '0');
  } else {
    const now = new Date();
    localDateString = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }
  const newSession = {
    id: Date.now(),
    date: localDateString,
    duration: session.duration,
    startTime: session.startTime,
    endTime: session.endTime,
    ...session
  };
  
  data.sessions.unshift(newSession); // Add to beginning
  saveData(data);
  return newSession;
};

export const getSessions = (limit = null) => {
  const data = loadData();
  const sessions = data.sessions || [];
  return limit ? sessions.slice(0, limit) : sessions;
};

export const deleteSession = (sessionId) => {
  const data = loadData();
  data.sessions = data.sessions.filter(session => session.id !== sessionId);
  saveData(data);
};

// Analytics helpers
export const getSessionsByDateRange = (startDate, endDate) => {
  const sessions = getSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
};

export const getSessionsByPeriod = (period = '7d') => {
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '3m':
      startDate.setMonth(now.getMonth() - 3);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }
  
  return getSessionsByDateRange(startDate, now);
};

// Settings management
export const updateSettings = (settings) => {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
};

export const getSettings = () => {
  const data = loadData();
  return data.settings || {};
}; 