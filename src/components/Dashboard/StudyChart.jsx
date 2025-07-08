import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styles from './StudyChart.module.css';

const CustomTooltip = ({ active, payload, label, period }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${styles['chart-tooltip']} glass-card`}>
        <div><strong>{period === 'today' ? `${payload[0].payload.hour}:00` : label}</strong></div>
        <div>Study Time: {payload[0].payload.formattedTime}</div>
      </div>
    );
  }
  return null;
};

const StudyChart = ({ data, period }) => {
  return (
    <div className={styles['study-chart-wrapper']}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          {period === 'today' ? (
            <XAxis dataKey="hour" tickFormatter={h => `${h}:00`} tick={{ fontSize: 12 }} domain={[0,23]} />
          ) : (
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          )}
          <YAxis 
            tick={{ fontSize: 12 }} 
            hide={false} 
            tickFormatter={v => period === 'today' ? (v/3600).toFixed(1) : v}
            label={period === 'today' ? { value: 'Hours', angle: -90, position: 'insideLeft', offset: 10 } : undefined}
          />
          <Tooltip content={<CustomTooltip period={period} />} />
          <Line type="monotone" dataKey="time" stroke="var(--accent-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(StudyChart); 