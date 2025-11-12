import React from 'react';
import StatCard from './StatCard';
import { JobOfferStatsDTO } from '@/types';

interface StatisticsPanelProps {
  stats: JobOfferStatsDTO;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3" data-testid="statistics-panel">
      <StatCard title="Total CVs" value={stats.total_cvs} testId="stat-total-cvs" />
      <StatCard title="Accepted" value={stats.accepted} testId="stat-accepted" />
      <StatCard title="Rejected" value={stats.rejected} testId="stat-rejected" />
    </div>
  );
};

export default StatisticsPanel;
