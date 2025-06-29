import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import styles from './StudyChart.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${styles['chart-tooltip']} glass-card`}>
        <div><strong>{label}</strong></div>
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
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} hide={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="time" stroke="var(--accent-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(StudyChart); 