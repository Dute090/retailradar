"use client";

import { usePlaces } from "@/hooks/usePlaces";
import { StoreCard } from "@/components/StoreCard";
import { MapPin, RefreshCw, Search } from "lucide-react";
import { useState, useMemo } from "react";

const FREE_LIMIT = 10;

export default function Home() {
  const { places, loading, error, location, refetch } = usePlaces();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return places;
    return places.filter((p) =>
      p.displayName.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [places, search]);

  const visible = filtered.slice(0, FREE_LIMIT);
  const hasMore = filtered.length > FREE_LIMIT;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#2563EB]">RetailRadar</h1>
            {location?.city && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin size={11} />
                <span>Near {location.city}</span>
              </div>
            )}
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
            aria-label="Refresh location"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Search */}
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <RefreshCw size={32} className="animate-spin mb-3" />
            <p className="text-sm">Finding stores near you...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm text-blue-600 font-medium underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && visible.length > 0 && (
          <>
            <p className="text-xs text-gray-400 px-1">
              Showing {visible.length} of {filtered.length} stores nearby
            </p>
            {visible.map((place) => (
              <StoreCard key={place.id} place={place} />
            ))}

            {/* Upgrade CTA */}
            {hasMore && (
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-center text-white mt-2">
                <p className="font-semibold text-base">
                  {filtered.length - FREE_LIMIT} more stores nearby
                </p>
                <p className="text-blue-100 text-sm mt-1">
                  Upgrade to Pro to see all stores, filter by open now, and save favorites.
                </p>
                <button className="mt-3 bg-white text-blue-600 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  Upgrade to Pro · $2.99/mo
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && !error && places.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <MapPin size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No stores found nearby.</p>
            <p className="text-xs mt-1">Try expanding your search radius.</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10">
        <div className="max-w-lg mx-auto flex">
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5 text-blue-600">
            <MapPin size={20} />
            <span className="text-xs font-medium">Nearby</span>
          </button>
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5 text-gray-400">
            <Search size={20} />
            <span className="text-xs">Search</span>
          </button>
        </div>
      </nav>

      {/* Bottom nav spacer */}
      <div className="h-16" />
    </div>
  );
}
