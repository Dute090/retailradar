"use client";

import { usePlaces } from "@/hooks/usePlaces";
import { StoreCard } from "@/components/StoreCard";
import { MapPin, RefreshCw, Search, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";

const FREE_LIMIT = 10;

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="p-4 flex gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="flex justify-between gap-2">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-5 bg-gray-100 rounded-full w-16" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-1/3" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
      <div className="border-t border-gray-50 px-4 py-2.5">
        <div className="h-8 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

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
  const openCount = places.filter(p => p.currentOpeningHours?.openNow).length;

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">🛒</span>
              <h1 className="text-xl font-extrabold text-[#2563EB] tracking-tight">RetailRadar</h1>
            </div>
            {location?.city ? (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin size={11} className="text-blue-400" />
                <span>Near <span className="font-medium text-gray-700">{location.city}</span></span>
                {!loading && places.length > 0 && (
                  <span className="ml-1 text-gray-400">· {openCount} open now</span>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-400 mt-0.5">Detecting location...</div>
            )}
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
            aria-label="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Search bar */}
        <div className="max-w-lg mx-auto px-4 pb-3 mt-2">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores nearby..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#F0F4FF] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3 pb-32">

        {/* Loading skeletons */}
        {loading && (
          <>
            <div className="flex items-center gap-2 px-1 py-1">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay:"0ms"}} />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay:"150ms"}} />
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay:"300ms"}} />
              <span className="text-xs text-gray-400 ml-1">Finding stores near you...</span>
            </div>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white border border-red-100 rounded-2xl p-5 text-center shadow-sm">
            <div className="text-3xl mb-2">📍</div>
            <p className="text-gray-700 text-sm font-medium">Couldn't get your location</p>
            <p className="text-gray-400 text-xs mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && visible.length > 0 && (
          <>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-gray-500 font-medium">
                {filtered.length} store{filtered.length !== 1 ? "s" : ""} nearby
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-blue-500">
                  Clear
                </button>
              )}
            </div>

            {visible.map((place) => (
              <StoreCard key={place.id} place={place} />
            ))}

            {/* Upgrade CTA */}
            {hasMore && (
              <div className="relative overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] rounded-2xl p-5 text-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
                <div className="relative">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={14} className="text-yellow-300" />
                    <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">Pro</span>
                  </div>
                  <p className="font-bold text-base">
                    {filtered.length - FREE_LIMIT} more stores nearby
                  </p>
                  <p className="text-blue-200 text-xs mt-1 leading-relaxed">
                    Unlock all stores, open-now filter, favorites, and holiday deal alerts.
                  </p>
                  <button className="mt-3 bg-white text-blue-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors w-full">
                    Upgrade to Pro · $2.99/mo
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && places.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="text-gray-600 font-medium">No stores found nearby</p>
            <p className="text-gray-400 text-sm mt-1">Try expanding your search radius.</p>
            <button
              onClick={refetch}
              className="mt-4 text-sm text-blue-600 font-medium border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10 shadow-[0_-1px_8px_rgba(0,0,0,0.06)] pb-safe">
        <div className="max-w-lg mx-auto flex">
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5 text-blue-600">
            <MapPin size={20} />
            <span className="text-[11px] font-semibold">Nearby</span>
          </button>
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5 text-gray-400">
            <Search size={20} />
            <span className="text-[11px]">Search</span>
          </button>
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5 text-gray-400">
            <Sparkles size={20} />
            <span className="text-[11px]">Pro</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
