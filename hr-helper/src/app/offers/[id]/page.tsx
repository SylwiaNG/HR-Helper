"use client";

import React, { useState, useEffect } from 'react';
import StatisticsPanel from '@/components/offers/StatisticsPanel';
import CVList from '@/components/offers/CVList';
import KeywordsPanel from '@/components/offers/KeywordsPanel';
import { JobOfferDTO, JobOfferStatsDTO, CVDTO } from '../../../../../src/types';

const OfferDetailsPage = ({ params }: { params: { id: string } }) => {
  const [offer, setOffer] = useState<JobOfferDTO | null>(null);
  const [stats, setStats] = useState<JobOfferStatsDTO | null>(null);
  const [cvs, setCvs] = useState<CVDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfferData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API calls with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockOffer: JobOfferDTO = {
          id: parseInt(params.id),
          user_id: 'auth-user-id',
          title: `Senior Frontend Developer (ID: ${params.id})`,
          description: 'Join our team to build the next generation of web applications.',
          keywords: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
          created_at: new Date().toISOString(),
        };

        const mockStats: JobOfferStatsDTO = {
          total_cvs: 12,
          accepted: 2,
          rejected: 3,
        };

        const mockCvs: CVDTO[] = [
          { id: 1, job_offer_id: parseInt(params.id), first_name: 'Jan', last_name: 'Kowalski', keywords: ['React', 'TypeScript'], match_percentage: 95, matched_keywords_count: 2, status: 'new', created_at: new Date().toISOString() },
          { id: 2, job_offer_id: parseInt(params.id), first_name: 'Anna', last_name: 'Nowak', keywords: ['Next.js', 'TailwindCSS'], match_percentage: 88, matched_keywords_count: 2, status: 'new', created_at: new Date().toISOString() },
          { id: 3, job_offer_id: parseInt(params.id), first_name: 'Piotr', last_name: 'Zieliński', keywords: ['React'], match_percentage: 75, matched_keywords_count: 1, status: 'new', created_at: new Date().toISOString() },
          { id: 4, job_offer_id: parseInt(params.id), first_name: 'Katarzyna', last_name: 'Wiśniewska', keywords: ['TypeScript', 'Next.js'], match_percentage: 92, matched_keywords_count: 2, status: 'accepted', created_at: new Date().toISOString() },
          { id: 5, job_offer_id: parseInt(params.id), first_name: 'Marek', last_name: 'Jankowski', keywords: ['JavaScript'], match_percentage: 60, matched_keywords_count: 1, status: 'rejected', created_at: new Date().toISOString() },
          { id: 6, job_offer_id: parseInt(params.id), first_name: 'Alicja', last_name: 'Wójcik', keywords: ['React', 'Next.js'], match_percentage: 85, matched_keywords_count: 2, status: 'accepted', created_at: new Date().toISOString() },
          { id: 7, job_offer_id: parseInt(params.id), first_name: 'Tomasz', last_name: 'Kowalczyk', keywords: ['CSS'], match_percentage: 40, matched_keywords_count: 1, status: 'rejected', created_at: new Date().toISOString() },
          { id: 8, job_offer_id: parseInt(params.id), first_name: 'Magdalena', last_name: 'Kamińska', keywords: ['HTML'], match_percentage: 30, matched_keywords_count: 1, status: 'rejected', created_at: new Date().toISOString() },
        ];

        setOffer(mockOffer);
        setStats(mockStats);
        setCvs(mockCvs);

      } catch (err) {
        setError('Failed to load offer data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferData();
  }, [params.id]);

  const handleStatusChange = async (cvId: number, newStatus: 'accepted' | 'rejected') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setCvs(prevCvs => prevCvs.map(cv => cv.id === cvId ? { ...cv, status: newStatus } : cv));

    setStats(prevStats => {
      if (!prevStats) return null;
      
      const cv = cvs.find(c => c.id === cvId);
      if (!cv) return prevStats;

      const isAccepting = newStatus === 'accepted';
      const wasAccepted = cv.status === 'accepted';
      const wasRejected = cv.status === 'rejected';

      let accepted = prevStats.accepted;
      let rejected = prevStats.rejected;

      if (isAccepting) {
        if (!wasAccepted) accepted++;
        if (wasRejected) rejected--;
      } else { // is rejecting
        if (wasAccepted) accepted--;
        if (!wasRejected) rejected++;
      }

      return { ...prevStats, accepted, rejected };
    });
  };

  if (loading) {
    return <div className="p-4">Ładowanie...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!offer) {
    return <div className="p-4">Nie znaleziono oferty.</div>;
  }

  const qualifiedCvs = cvs.filter(cv => cv.status === 'new' || cv.status === 'accepted');
  const rejectedCvs = cvs.filter(cv => cv.status === 'rejected');

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">{offer.title}</h1>
      
      {stats && <StatisticsPanel stats={stats} />}

      {offer && <KeywordsPanel offer={offer} onUpdate={async () => {}} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CVList title="Zakwalifikowane" cvs={qualifiedCvs} onStatusChange={handleStatusChange} />
        <CVList title="Odrzucone" cvs={rejectedCvs} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default OfferDetailsPage;
