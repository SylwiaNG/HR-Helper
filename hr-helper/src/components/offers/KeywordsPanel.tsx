import React from 'react';
import { JobOfferDTO } from '../../../../src/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';

interface KeywordsPanelProps {
  offer: JobOfferDTO;
  onUpdate: (updatedKeywords: string[]) => Promise<void>;
}

const KeywordsPanel: React.FC<KeywordsPanelProps> = ({ offer, onUpdate }) => {
  // Logic for editing will be added in the next steps
  const isEditing = false; 

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Słowa kluczowe</h2>
        <Button size="sm" onClick={() => { /* TODO: Toggle edit mode */ }}>
          {isEditing ? 'Zapisz' : 'Edytuj'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {offer.keywords?.map(keyword => <Badge key={keyword}>{keyword}</Badge>)}
      </div>
    </div>
  );
};

export default KeywordsPanel;
