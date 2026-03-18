"use client";

import { usePlaces } from "@/hooks/usePlaces";
import { StoreCard } from "@/components/StoreCard";
import { MapPin, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { useState, useMemo } from "react";

const FREE_LIMIT = 10;

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <div className="h-1 bg-gray-100" />
      <div className="p-4 flex gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-2.5 pt-1">
          <div className="h-2.5 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
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
  const openCount = places.filter(
    (p) => p.currentOpeningHours?.openNow || p.regularOpeningHours?.openNow
  ).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F7FA" }}>

      {/* Header */}
      <header className="bg-white sticky top-0 z-20" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
        <div className="max-w-lg mx-auto px-4 pt-5 pb-3">
          {/* Brand */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Retail<span style={{ color: "#2563EB" }}>Radar</span>
              </h1>
              {location?.city ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={12} style={{ color: "#2563EB" }} />
                  <span className="text-sm text-gray-500">
                    Near <span className="font-semibold text-gray-700">{location.city}</span>
                  </span>
                  {!loading && openCount > 0 && (
                    <span className="ml-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {openCount} open
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-0.5">Detecting your location…</p>
              )}
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-30"
              style={{ backgroundColor: "#F5F7FA" }}
              aria-label="Refresh"
            >
              <RotateCcw size={17} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search stores…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: "#F5F7FA", border: "1.5px solid #E5E7EB" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-32 space-y-3">

        {/* Loading */}
        {loading && (
          <>
            <p className="text-sm text-gray-400 px-1 py-1">Finding stores near you…</p>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <MapPin size={24} className="text-red-400" />
            </div>
            <p className="font-semibold text-gray-800">Location unavailable</p>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-2xl transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && visible.length > 0 && (
          <>
            <p className="text-xs font-medium text-gray-400 px-1">
              {filtered.length} store{filtered.length !== 1 ? "s" : ""} nearby
            </p>

            {visible.map((place) => (
              <StoreCard key={place.id} place={place} />
            ))}

            {/* Pro upsell */}
            {hasMore && (
              <div
                className="rounded-2xl p-5 text-white overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563EB 60%, #3b82f6 100%)" }}
              >
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/5" />
                <div className="relative">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={14} className="text-yellow-300" />
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Pro</span>
                  </div>
                  <p className="font-bold text-lg leading-tight">
                    {filtered.length - FREE_LIMIT} more stores nearby
                  </p>
                  <p className="text-blue-200 text-sm mt-1 leading-relaxed">
                    Unlock all stores, open-now filter, favorites & holiday alerts.
                  </p>
                  <button className="mt-4 w-full bg-white text-blue-700 font-bold text-sm py-3 rounded-2xl hover:bg-blue-50 transition-colors">
                    Upgrade to Pro · $2.99/mo
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && !error && places.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <MapPin size={32} className="text-gray-300" />
            </div>
            <p className="font-semibold text-gray-600">No stores found nearby</p>
            <p className="text-sm text-gray-400 mt-1">Try refreshing or expanding your area.</p>
            <button
              onClick={refetch}
              className="mt-4 text-sm font-semibold text-blue-600 border border-blue-200 px-5 py-2.5 rounded-2xl hover:bg-blue-50 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-white z-20 pb-safe"
        style={{ boxShadow: "0 -1px 0 #E5E7EB" }}
      >
        <div className="max-w-lg mx-auto flex">
          <button className="flex-1 py-3.5 flex flex-col items-center gap-1">
            <MapPin size={21} style={{ color: "#2563EB" }} />
            <span className="text-[11px] font-bold" style={{ color: "#2563EB" }}>Nearby</span>
          </button>
          <button className="flex-1 py-3.5 flex flex-col items-center gap-1">
            <Search size={21} className="text-gray-300" />
            <span className="text-[11px] text-gray-400">Search</span>
          </button>
          <button className="flex-1 py-3.5 flex flex-col items-center gap-1">
            <Sparkles size={21} className="text-gray-300" />
            <span className="text-[11px] text-gray-400">Pro</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
