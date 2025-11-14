import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// Tymczasowe dane przykładowe - później będą z bazy danych
const mockJobOffers = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    keywords: ["React", "TypeScript", "Next.js"],
    acceptedCVs: 5,
    rejectedCVs: 3,
    totalCVs: 8,
  },
  {
    id: 2,
    title: "Backend Developer",
    keywords: ["Node.js", "PostgreSQL", "API"],
    acceptedCVs: 4,
    rejectedCVs: 2,
    totalCVs: 6,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    keywords: ["JavaScript", "React", "Node.js", "MongoDB"],
    acceptedCVs: 3,
    rejectedCVs: 4,
    totalCVs: 7,
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold text-gray-900"
            data-testid="dashboard-title"
          >
            Dashboard rekrutera
          </h1>
          <p className="mt-2 text-gray-600">
            Zarządzaj swoimi ofertami pracy i przeglądaj nadesłane CV
          </p>
        </div>

        {/* Job Offers Grid */}
        <div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          data-testid="offers-grid"
        >
          {mockJobOffers.map((offer) => (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}`}
              className="block"
              data-testid="offer-card"
            >
              <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <h3 
                  className="text-lg font-semibold text-gray-900"
                  data-testid="offer-title"
                >
                  {offer.title}
                </h3>

                {/* Keywords */}
                <div 
                  className="mt-3 flex flex-wrap gap-2"
                  data-testid="offer-keywords"
                >
                  {offer.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                      data-testid="keyword-badge"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Statistics */}
                <div className="mt-4 space-y-2">
                  <div 
                    className="flex items-center justify-between text-sm"
                    data-testid="stat-total"
                  >
                    <span className="text-gray-600">Łącznie CV:</span>
                    <span className="font-semibold">{offer.totalCVs}</span>
                  </div>
                  <div 
                    className="flex items-center justify-between text-sm"
                    data-testid="stat-accepted"
                  >
                    <span className="text-gray-600">Zaakceptowane:</span>
                    <span className="font-semibold text-green-600">
                      {offer.acceptedCVs}
                    </span>
                  </div>
                  <div 
                    className="flex items-center justify-between text-sm"
                    data-testid="stat-rejected"
                  >
                    <span className="text-gray-600">Odrzucone:</span>
                    <span className="font-semibold text-red-600">
                      {offer.rejectedCVs}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State (if no offers) */}
        {mockJobOffers.length === 0 && (
          <div 
            className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center"
            data-testid="empty-state"
          >
            <h3 className="text-lg font-medium text-gray-900">
              Brak ofert pracy
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Rozpocznij od utworzenia pierwszej oferty pracy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
