import React, { useState, useEffect } from 'react';
import { JobOfferDTO } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

interface KeywordsPanelProps {
  offer: JobOfferDTO;
  onUpdate: (updatedKeywords: string[]) => Promise<void>;
}

const KeywordsPanel: React.FC<KeywordsPanelProps> = ({ offer, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableKeywords, setEditableKeywords] = useState(offer.keywords || []);
  const [newKeyword, setNewKeyword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditableKeywords(offer.keywords || []);
    }
  }, [isEditing, offer.keywords]);

  const handleAddKeyword = () => {
    if (newKeyword && !editableKeywords.includes(newKeyword)) {
      setEditableKeywords([...editableKeywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setEditableKeywords(editableKeywords.filter((k: string) => k !== keywordToRemove));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    await onUpdate(editableKeywords);
    setIsUpdating(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Słowa kluczowe</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? 'Zapisywanie...' : 'Zapisz'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isUpdating}>
                Anuluj
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edytuj
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {editableKeywords.map((keyword: string) => (
              <Badge key={keyword} className="flex items-center gap-1">
                {keyword}
                <button onClick={() => handleRemoveKeyword(keyword)} className="rounded-full hover:bg-gray-200 p-0.5">
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              placeholder="Dodaj słowo kluczowe..."
            />
            <Button onClick={handleAddKeyword}>Dodaj</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {offer.keywords?.map((keyword: string) => <Badge key={keyword}>{keyword}</Badge>)}
        </div>
      )}
    </div>
  );
};

export default KeywordsPanel;
