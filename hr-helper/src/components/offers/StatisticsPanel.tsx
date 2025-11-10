import React from 'react';
import StatCard from './StatCard';
import { JobOfferStatsDTO } from '../../../../src/types';

interface StatisticsPanelProps {
  stats: JobOfferStatsDTO;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Total CVs" value={stats.total_cvs} />
      <StatCard title="Accepted" value={stats.accepted} />
      <StatCard title="Rejected" value={stats.rejected} />
    </div>
  );
};

export default StatisticsPanel;
