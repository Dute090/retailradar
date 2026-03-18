"use client";

import { Place } from "@/lib/types";
import { cn, formatDistance } from "@/lib/utils";
import { MapPin, Clock, Navigation } from "lucide-react";

interface StoreCardProps {
  place: Place;
}

const BRAND_COLORS: Record<string, string> = {
  walmart: "bg-blue-600",
  target: "bg-red-600",
  costco: "bg-blue-800",
  kroger: "bg-blue-500",
  "whole foods": "bg-green-700",
  aldi: "bg-blue-700",
  "trader joe": "bg-red-700",
  publix: "bg-green-600",
  meijer: "bg-red-500",
  "h-e-b": "bg-red-600",
};

function getBrandColor(name: string): string {
  const lower = name.toLowerCase();
  for (const [brand, color] of Object.entries(BRAND_COLORS)) {
    if (lower.includes(brand)) return color;
  }
  return "bg-gray-500";
}

function getBrandInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function StoreCard({ place }: StoreCardProps) {
  const isOpen = place.currentOpeningHours?.openNow;
  const todayHours = place.currentOpeningHours?.weekdayDescriptions?.[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const hoursText = todayHours?.split(": ")[1] || "Hours unavailable";
  const isOperational = place.businessStatus === "OPERATIONAL";

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.formattedAddress
  )}&destination_place_id=${place.id}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 items-start">
      {/* Brand Logo */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
          getBrandColor(place.displayName.text)
        )}
      >
        {getBrandInitials(place.displayName.text)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight truncate">
            {place.displayName.text}
          </h3>
          {/* Status Badge */}
          {isOperational ? (
            <span
              className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0",
                isOpen === true
                  ? "bg-green-100 text-green-700"
                  : isOpen === false
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {isOpen === true ? "Open" : isOpen === false ? "Closed" : "Unknown"}
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 flex-shrink-0">
              Permanently Closed
            </span>
          )}
        </div>

        {/* Hours */}
        <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500">
          <Clock size={13} className="flex-shrink-0" />
          <span className="truncate">{hoursText}</span>
        </div>

        {/* Address + Distance */}
        <div className="flex items-start gap-1.5 mt-1 text-sm text-gray-400">
          <MapPin size={13} className="flex-shrink-0 mt-0.5" />
          <span className="truncate">{place.formattedAddress}</span>
          {place.distance !== undefined && (
            <span className="flex-shrink-0 text-gray-500 font-medium">
              · {formatDistance(place.distance)}
            </span>
          )}
        </div>
      </div>

      {/* Navigate Button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2.5 transition-colors"
        aria-label={`Navigate to ${place.displayName.text}`}
      >
        <Navigation size={18} />
      </a>
    </div>
  );
}
