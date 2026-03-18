"use client";

import { Place } from "@/lib/types";
import { formatDistance } from "@/lib/utils";
import { MapPin, Clock, ChevronRight } from "lucide-react";

interface StoreCardProps {
  place: Place;
}

// Brand config: accent color + text abbreviation for logo circle
const BRANDS: Record<string, { color: string; label: string; textColor: string }> = {
  walmart:       { color: "#0071CE", label: "W",   textColor: "#fff" },
  target:        { color: "#CC0000", label: "T",   textColor: "#fff" },
  costco:        { color: "#005DAA", label: "C",   textColor: "#fff" },
  kroger:        { color: "#2563EB", label: "K",   textColor: "#fff" },
  "whole foods": { color: "#00674B", label: "WF",  textColor: "#fff" },
  aldi:          { color: "#1A3E6F", label: "A",   textColor: "#fff" },
  "trader joe":  { color: "#B22222", label: "TJ",  textColor: "#fff" },
  publix:        { color: "#1A7A3C", label: "P",   textColor: "#fff" },
  "h-e-b":       { color: "#CC0000", label: "HEB", textColor: "#fff" },
  safeway:       { color: "#CC0000", label: "S",   textColor: "#fff" },
  macy:          { color: "#CC0000", label: "M",   textColor: "#fff" },
  saks:          { color: "#1a1a1a", label: "SF",  textColor: "#fff" },
  nordstrom:     { color: "#333",    label: "N",   textColor: "#fff" },
  bloomingdale:  { color: "#555",    label: "B",   textColor: "#fff" },
  "best buy":    { color: "#003B8E", label: "BB",  textColor: "#FFE000" },
  cvs:           { color: "#CC0000", label: "CVS", textColor: "#fff" },
  walgreens:     { color: "#E31837", label: "W",   textColor: "#fff" },
  sprouts:       { color: "#4CAF50", label: "S",   textColor: "#fff" },
  "food lion":   { color: "#E31837", label: "FL",  textColor: "#fff" },
  wegmans:       { color: "#006341", label: "W",   textColor: "#fff" },
};

function getBrand(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(BRANDS)) {
    if (lower.includes(key)) return val;
  }
  // Generate a consistent color from name
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return {
    color: `hsl(${hue}, 55%, 40%)`,
    label: name.slice(0, 2).toUpperCase(),
    textColor: "#fff",
  };
}

function getTodayHours(place: Place): string {
  const hours = place.currentOpeningHours || place.regularOpeningHours;
  if (!hours?.weekdayDescriptions?.length) return "Hours unavailable";
  const dayIndex = new Date().getDay();
  const idx = dayIndex === 0 ? 6 : dayIndex - 1;
  return hours.weekdayDescriptions[idx]?.split(": ")[1] || "Hours unavailable";
}

function getStoreCategory(types: string[]): string {
  if (types.includes("supermarket") || types.includes("grocery_store")) return "Grocery";
  if (types.includes("department_store")) return "Department Store";
  if (types.includes("convenience_store")) return "Convenience";
  if (types.includes("drugstore") || types.includes("pharmacy")) return "Pharmacy";
  return "Retail";
}

export function StoreCard({ place }: StoreCardProps) {
  const isOpen = place.currentOpeningHours?.openNow ?? place.regularOpeningHours?.openNow;
  const isOperational = place.businessStatus === "OPERATIONAL";
  const brand = getBrand(place.displayName.text);
  const hoursText = getTodayHours(place);
  const category = getStoreCategory(place.types || []);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.formattedAddress
  )}&destination_place_id=${place.id}`;

  const statusDot = !isOperational
    ? "bg-gray-300"
    : isOpen === true
    ? "bg-emerald-500"
    : "bg-gray-300";

  const statusLabel = !isOperational
    ? "Permanently closed"
    : isOpen === true
    ? "Open now"
    : isOpen === false
    ? "Closed"
    : "Hours unknown";

  const statusColor = !isOperational
    ? "text-gray-400"
    : isOpen === true
    ? "text-emerald-600"
    : "text-gray-400";

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl overflow-hidden active:scale-[0.985] transition-transform"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)" }}
    >
      {/* Accent top bar */}
      <div className="h-1 w-full" style={{ backgroundColor: brand.color }} />

      <div className="p-4 flex gap-4 items-start">
        {/* Brand logo circle */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-black tracking-tight shadow-sm"
          style={{ backgroundColor: brand.color, color: brand.textColor }}
        >
          {brand.label}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category pill */}
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {category}
          </span>

          {/* Store name */}
          <h3 className="font-bold text-gray-900 mt-0.5 leading-snug" style={{ fontSize: 17 }}>
            {place.displayName.text}
          </h3>

          {/* Status + hours */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />
            <span className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</span>
            {isOpen === true && (
              <span className="text-sm text-gray-400">· {hoursText}</span>
            )}
          </div>

          {isOpen === false && (
            <p className="text-sm text-gray-400 mt-0.5">{hoursText}</p>
          )}

          {/* Address + distance */}
          <div className="flex items-start gap-1.5 mt-2">
            <MapPin size={13} className="text-gray-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500 leading-snug">
              {place.formattedAddress}
            </p>
          </div>

          {place.distance !== undefined && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock size={13} className="text-gray-300 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-600">
                {formatDistance(place.distance)} away
              </span>
            </div>
          )}
        </div>

        {/* Chevron */}
        <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-1" />
      </div>
    </a>
  );
}
