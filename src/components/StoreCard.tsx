"use client";

import { Place } from "@/lib/types";
import { cn, formatDistance } from "@/lib/utils";
import { MapPin, Clock, Navigation, Star, Phone } from "lucide-react";

interface StoreCardProps {
  place: Place;
}

const BRAND_CONFIG: Record<string, { bg: string; text: string; emoji: string }> = {
  walmart:      { bg: "bg-blue-600",   text: "text-white", emoji: "🛒" },
  target:       { bg: "bg-red-600",    text: "text-white", emoji: "🎯" },
  costco:       { bg: "bg-blue-800",   text: "text-white", emoji: "📦" },
  kroger:       { bg: "bg-blue-500",   text: "text-white", emoji: "🛍️" },
  "whole foods":{ bg: "bg-green-700",  text: "text-white", emoji: "🌿" },
  aldi:         { bg: "bg-blue-700",   text: "text-white", emoji: "🏪" },
  "trader joe": { bg: "bg-red-700",    text: "text-white", emoji: "🌺" },
  publix:       { bg: "bg-green-600",  text: "text-white", emoji: "🛒" },
  meijer:       { bg: "bg-red-500",    text: "text-white", emoji: "🏬" },
  "h-e-b":      { bg: "bg-red-600",    text: "text-white", emoji: "⭐" },
  safeway:      { bg: "bg-red-500",    text: "text-white", emoji: "🛒" },
  "macy's":     { bg: "bg-red-700",    text: "text-white", emoji: "🏬" },
  macys:        { bg: "bg-red-700",    text: "text-white", emoji: "🏬" },
  saks:         { bg: "bg-gray-900",   text: "text-white", emoji: "👜" },
  nordstrom:    { bg: "bg-gray-800",   text: "text-white", emoji: "👗" },
  bloomingdale: { bg: "bg-gray-700",   text: "text-white", emoji: "🛍️" },
  "best buy":   { bg: "bg-blue-700",   text: "text-white", emoji: "📺" },
  cvs:          { bg: "bg-red-600",    text: "text-white", emoji: "💊" },
  walgreens:    { bg: "bg-red-500",    text: "text-white", emoji: "💊" },
};

function getBrandConfig(name: string) {
  const lower = name.toLowerCase();
  for (const [brand, config] of Object.entries(BRAND_CONFIG)) {
    if (lower.includes(brand)) return config;
  }
  return { bg: "bg-indigo-500", text: "text-white", emoji: "🏪" };
}

function getBrandInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={11}
            className={cn(
              i <= full ? "fill-amber-400 text-amber-400" :
              i === full + 1 && half ? "fill-amber-200 text-amber-400" :
              "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count >= 1000 ? `${(count/1000).toFixed(1)}k` : count})</span>
      )}
    </div>
  );
}

function getTodayHours(place: Place): string {
  const hours = place.currentOpeningHours || place.regularOpeningHours;
  if (!hours?.weekdayDescriptions?.length) return "Hours unavailable";
  // weekdayDescriptions[0] = Monday, [6] = Sunday
  const dayIndex = new Date().getDay(); // 0=Sun
  const idx = dayIndex === 0 ? 6 : dayIndex - 1;
  const desc = hours.weekdayDescriptions[idx] || "";
  return desc.split(": ")[1] || "Hours unavailable";
}

export function StoreCard({ place }: StoreCardProps) {
  const isOpen = place.currentOpeningHours?.openNow ?? place.regularOpeningHours?.openNow;
  const isOperational = place.businessStatus === "OPERATIONAL";
  const brand = getBrandConfig(place.displayName.text);
  const hoursText = getTodayHours(place);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.formattedAddress
  )}&destination_place_id=${place.id}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.99] transition-transform">
      {/* Top row */}
      <div className="p-4 flex gap-3 items-start">
        {/* Brand avatar */}
        <div className={cn("w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm", brand.bg)}>
          <span className="text-xl leading-none">{brand.emoji}</span>
          <span className={cn("text-[10px] font-bold mt-0.5 tracking-wide", brand.text)}>
            {getBrandInitials(place.displayName.text)}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-[15px] leading-tight">
              {place.displayName.text}
            </h3>
            <span className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5",
              !isOperational ? "bg-gray-100 text-gray-400" :
              isOpen === true  ? "bg-green-100 text-green-700" :
              isOpen === false ? "bg-red-50 text-red-500" :
                                 "bg-gray-100 text-gray-400"
            )}>
              {!isOperational ? "Closed" : isOpen === true ? "Open now" : isOpen === false ? "Closed" : "—"}
            </span>
          </div>

          {/* Rating */}
          {place.rating !== undefined && (
            <div className="mt-1">
              <StarRating rating={place.rating} count={place.userRatingCount} />
            </div>
          )}

          {/* Hours */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
            <Clock size={11} className="flex-shrink-0 text-gray-400" />
            <span className="truncate">{hoursText}</span>
          </div>

          {/* Address + distance */}
          <div className="flex items-start gap-1.5 mt-1 text-xs text-gray-400">
            <MapPin size={11} className="flex-shrink-0 mt-0.5 text-gray-300" />
            <span className="truncate">{place.formattedAddress}</span>
            {place.distance !== undefined && (
              <span className="flex-shrink-0 text-gray-500 font-semibold ml-1">
                {formatDistance(place.distance)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="border-t border-gray-50 px-4 py-2.5 flex items-center gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors"
        >
          <Navigation size={13} />
          Directions
        </a>
        {place.nationalPhoneNumber && (
          <a
            href={`tel:${place.nationalPhoneNumber}`}
            className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Phone size={13} />
            Call
          </a>
        )}
        {place.websiteUri && (
          <a
            href={place.websiteUri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-medium py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Website
          </a>
        )}
      </div>
    </div>
  );
}
