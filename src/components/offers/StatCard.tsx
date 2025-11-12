import React from 'react';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "../ui/CustomCard";

interface StatCardProps {
  title: string;
  value: number | string;
  testId?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, testId }) => {
  return (
    <CustomCard data-testid={testId}>
      <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CustomCardTitle className="text-sm font-medium">{title}</CustomCardTitle>
      </CustomCardHeader>
      <CustomCardContent>
        <div className="text-2xl font-bold" data-testid={`${testId}-value`}>{value}</div>
      </CustomCardContent>
    </CustomCard>
  );
};

export default StatCard;
