"use client";

import React, { useState, useEffect, use } from 'react';
import CVList from "@/components/offers/CVList";
import KeywordsPanel from "@/components/offers/KeywordsPanel";
import StatisticsPanel from "@/components/offers/StatisticsPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { CVDTO, JobOfferDTO, JobOfferStatsDTO } from "@/types";
import { toast } from "sonner";

const OfferDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [offer, setOffer] = useState<JobOfferDTO | null>(null);
  const [stats, setStats] = useState<JobOfferStatsDTO | null>(null);
  const [cvs, setCvs] = useState<CVDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOfferData = async () => {
      setLoading(true);
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock offers matching dashboard data
        const mockOffers = [
          {
            id: 1,
            title: 'Senior Frontend Developer',
            description: 'Join our team to work on exciting frontend projects.',
            keywords: ['React', 'TypeScript', 'Next.js'],
          },
          {
            id: 2,
            title: 'Backend Developer',
            description: 'Build scalable backend systems.',
            keywords: ['Node.js', 'PostgreSQL', 'API'],
          },
          {
            id: 3,
            title: 'Full Stack Developer',
            description: 'Work on both frontend and backend.',
            keywords: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          },
        ];

        const mockOfferData = mockOffers.find(o => o.id === parseInt(id)) || mockOffers[0];

        const mockOffer: JobOfferDTO = {
          id: parseInt(id),
          user_id: 'auth0|12345', // Mock user_id
          title: mockOfferData.title,
          description: mockOfferData.description,
          keywords: mockOfferData.keywords,
          created_at: new Date().toISOString(),
        };

        const mockCvs: CVDTO[] = [
          { id: 1, job_offer_id: parseInt(id), first_name: 'Jan', last_name: 'Kowalski', keywords: ['React', 'TypeScript'], match_percentage: 95, matched_keywords_count: 2, status: 'new', created_at: new Date().toISOString() },
          { id: 2, job_offer_id: parseInt(id), first_name: 'Anna', last_name: 'Nowak', keywords: ['Next.js', 'TailwindCSS'], match_percentage: 88, matched_keywords_count: 2, status: 'new', created_at: new Date().toISOString() },
          { id: 3, job_offer_id: parseInt(id), first_name: 'Piotr', last_name: 'Zieliński', keywords: ['React'], match_percentage: 75, matched_keywords_count: 1, status: 'new', created_at: new Date().toISOString() },
          { id: 4, job_offer_id: parseInt(id), first_name: 'Katarzyna', last_name: 'Wiśniewska', keywords: ['TypeScript', 'Next.js'], match_percentage: 92, matched_keywords_count: 2, status: 'accepted', created_at: new Date().toISOString() },
          { id: 5, job_offer_id: parseInt(id), first_name: 'Marek', last_name: 'Jankowski', keywords: ['JavaScript'], match_percentage: 60, matched_keywords_count: 1, status: 'rejected', created_at: new Date().toISOString() },
          { id: 6, job_offer_id: parseInt(id), first_name: 'Alicja', last_name: 'Wójcik', keywords: ['React', 'Next.js'], match_percentage: 85, matched_keywords_count: 2, status: 'accepted', created_at: new Date().toISOString() },
          { id: 7, job_offer_id: parseInt(id), first_name: 'Tomasz', last_name: 'Kowalczyk', keywords: ['CSS'], match_percentage: 40, matched_keywords_count: 1, status: 'rejected', created_at: new Date().toISOString() },
          { id: 8, job_offer_id: parseInt(id), first_name: 'Magdalena', last_name: 'Kamińska', keywords: ['HTML'], match_percentage: 30, matched_keywords_count: 1, status: 'rejected', created_at: new Date().toISOString() },
        ];

        const mockStats: JobOfferStatsDTO = {
          total_cvs: mockCvs.length,
          accepted: mockCvs.filter(cv => cv.status === 'accepted').length,
          rejected: mockCvs.filter(cv => cv.status === 'rejected').length,
        };

        setOffer(mockOffer);
        setCvs(mockCvs);
        setStats(mockStats);

      } catch (err) {
        setError('Failed to load offer data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferData();
  }, [id]);

  const handleStatusChange = async (cvId: number, newStatus: 'accepted' | 'rejected') => {
    // Simulate API call with potential failure
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a 50% chance of failure
        if (Math.random() > 0.9) {
          reject(new Error("Failed to update status"));
        } else {
          resolve(true);
        }
      }, 500);
    });

    toast.promise(promise, {
      loading: 'Aktualizowanie statusu...',
      success: () => {
        // Optimistic UI update
        const updatedCvs = cvs.map(cv =>
          cv.id === cvId ? { ...cv, status: newStatus } : cv
        );
        setCvs(updatedCvs);

        // Update stats
        setStats(prevStats => {
          if (!prevStats) return null;
          const accepted = updatedCvs.filter(cv => cv.status === 'accepted').length;
          const rejected = updatedCvs.filter(cv => cv.status === 'rejected').length;
          return { ...prevStats, accepted, rejected };
        });
        return `Status CV został pomyślnie zaktualizowany.`;
      },
      error: 'Nie udało się zaktualizować statusu.',
    });
  };

  const handleKeywordsUpdate = async (updatedKeywords: string[]) => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.9) {
          reject(new Error("Failed to update keywords"));
        } else {
          if (offer) {
            setOffer({ ...offer, keywords: updatedKeywords });
          }
          resolve(true);
        }
      }, 500);
    });

    toast.promise(promise, {
      loading: 'Aktualizowanie słów kluczowych...',
      success: 'Słowa kluczowe zostały pomyślnie zaktualizowane.',
      error: 'Nie udało się zaktualizować słów kluczowych.',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-12 w-1/2 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>

        <Skeleton className="h-32 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-40" />
          </div>
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
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
    <div className="container mx-auto p-4 space-y-8" data-testid="offer-details-page">
      <h1 className="text-3xl font-bold" data-testid="offer-details-title">{offer.title}</h1>
      
      {stats && <StatisticsPanel stats={stats} />}

      {offer && <KeywordsPanel offer={offer} onUpdate={handleKeywordsUpdate} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-testid="cv-lists-container">
        <CVList title="Zakwalifikowane" cvs={qualifiedCvs} onStatusChange={handleStatusChange} />
        <CVList title="Odrzucone" cvs={rejectedCvs} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default OfferDetailsPage;
