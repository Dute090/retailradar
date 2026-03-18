"use client";

import { usePlaces } from "@/hooks/usePlaces";
import { StoreCard } from "@/components/StoreCard";
import { MapPin, Search, Sparkles, X, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";

const FREE_LIMIT = 10;

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-4 bg-white animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded-full w-2/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 rounded-full w-3/4" />
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-100 ml-20" />;
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
  const openCount = places.filter(
    (p) => p.currentOpeningHours?.openNow || p.regularOpeningHours?.openNow
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header — Apple Settings style */}
      <header className="bg-gray-50 sticky top-0 z-20 pt-safe">
        <div className="max-w-lg mx-auto px-4 pt-6 pb-2">
          {/* Title row */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Nearby Stores
              </h1>
              {location?.city ? (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-blue-500" />
                  <span className="text-sm text-gray-500">
                    {location.city}
                  </span>
                  {!loading && openCount > 0 && (
                    <>
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="text-sm text-emerald-600 font-medium">{openCount} open</span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-1">Locating…</p>
              )}
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-30 shadow-sm border border-gray-100"
              aria-label="Refresh"
            >
              <RotateCcw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Search bar — iOS style */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-white rounded-xl text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none border border-gray-200 focus:border-blue-400 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center"
              >
                <X size={11} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pb-32 space-y-6">

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <SkeletonRow />
                {i < 3 && <Divider />}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <MapPin size={22} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-800 text-[15px]">Location unavailable</p>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed max-w-xs mx-auto">{error}</p>
            <button
              onClick={refetch}
              className="mt-5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && visible.length > 0 && (
          <>
            {/* Section label */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-2">
                {filtered.length} store{filtered.length !== 1 ? "s" : ""} nearby
              </p>

              {/* Card group — iOS grouped list */}
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                {visible.map((place, i) => (
                  <div key={place.id}>
                    <StoreCard place={place} />
                    {i < visible.length - 1 && <Divider />}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro upsell */}
            {hasMore && (
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="px-4 py-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Sparkles size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-[15px]">
                        {filtered.length - FREE_LIMIT} more stores nearby
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5 leading-relaxed">
                        Upgrade to see all stores, filter by open now, save favorites, and get holiday alerts.
                      </p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[15px] py-3 rounded-xl transition-colors">
                    Upgrade to Pro · $2.99/mo
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && !error && places.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <MapPin size={22} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-700">No stores found</p>
            <p className="text-sm text-gray-400 mt-1">Try refreshing or moving to a different area.</p>
            <button
              onClick={refetch}
              className="mt-4 text-blue-500 text-sm font-semibold"
            >
              Refresh
            </button>
          </div>
        )}
      </main>

      {/* Bottom nav — iOS tab bar style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md z-20 pb-safe border-t border-gray-200/60">
        <div className="max-w-lg mx-auto flex">
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <MapPin size={22} className="text-blue-500" />
            <span className="text-[10px] font-semibold text-blue-500">Nearby</span>
          </button>
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <Search size={22} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">Search</span>
          </button>
          <button className="flex-1 py-3 flex flex-col items-center gap-0.5">
            <Sparkles size={22} className="text-gray-400" />
            <span className="text-[10px] text-gray-400">Pro</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
