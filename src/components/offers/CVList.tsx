import React from 'react';
import { CVDTO } from '../../../../src/types';
import CVCard from './CVCard';

interface CVListProps {
  title: string;
  cvs: CVDTO[];
  onStatusChange: (cvId: number, newStatus: 'accepted' | 'rejected') => Promise<void>;
}

const CVList: React.FC<CVListProps> = ({ title, cvs, onStatusChange }) => {
  const bgColor = title === 'Zakwalifikowane' ? 'bg-green-50' : 'bg-red-50';

  return (
    <section className={`p-4 rounded-lg ${bgColor}`}>
      <h2 className="text-xl font-bold mb-4">{title} ({cvs.length})</h2>
      <div className="space-y-4">
        {cvs.length > 0 ? (
          cvs.map(cv => (
            <CVCard key={cv.id} cv={cv} onStatusChange={onStatusChange} />
          ))
        ) : (
          <p className="text-gray-500">Brak CV w tej kategorii.</p>
        )}
      </div>
    </section>
  );
};

export default CVList;
