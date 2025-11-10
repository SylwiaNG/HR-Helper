import React from 'react';
import { CVDTO } from '../../../../src/types';
import { CustomCard, CustomCardContent, CustomCardTitle } from '../ui/CustomCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';

interface CVCardProps {
  cv: CVDTO;
  onStatusChange: (cvId: number, newStatus: 'accepted' | 'rejected') => Promise<void>;
}

const CVCard: React.FC<CVCardProps> = ({ cv, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdate = async (newStatus: 'accepted' | 'rejected') => {
    setIsUpdating(true);
    await onStatusChange(cv.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <CustomCard>
      <CustomCardContent className="p-4 space-y-2">
        <CustomCardTitle className="text-lg">{cv.first_name} {cv.last_name}</CustomCardTitle>
        <p className="text-sm text-gray-500">Dopasowanie: {cv.match_percentage}%</p>
        <div className="flex flex-wrap gap-2">
          {cv.keywords?.map(keyword => <Badge key={keyword}>{keyword}</Badge>)}
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          {cv.status !== 'accepted' && (
            <Button onClick={() => handleUpdate('accepted')} disabled={isUpdating} size="sm">
              {isUpdating ? '...' : 'Akceptuj'}
            </Button>
          )}
          {cv.status !== 'rejected' && (
            <Button onClick={() => handleUpdate('rejected')} disabled={isUpdating} size="sm" variant="destructive">
              {isUpdating ? '...' : 'Odrzuć'}
            </Button>
          )}
        </div>
      </CustomCardContent>
    </CustomCard>
  );
};

export default CVCard;
