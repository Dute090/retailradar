"use client";

import { Place } from "@/lib/types";
import { cn, formatDistance } from "@/lib/utils";
import { Navigation } from "lucide-react";

interface StoreCardProps {
  place: Place;
}

const BRAND_CONFIG: Record<string, { bg: string; emoji: string }> = {
  walmart:       { bg: "#0071CE", emoji: "🛒" },
  target:        { bg: "#CC0000", emoji: "🎯" },
  costco:        { bg: "#005DAA", emoji: "📦" },
  kroger:        { bg: "#2563EB", emoji: "🛍️" },
  "whole foods": { bg: "#00674B", emoji: "🌿" },
  aldi:          { bg: "#1A3E6F", emoji: "🏪" },
  "trader joe":  { bg: "#B22222", emoji: "🌺" },
  publix:        { bg: "#1A7A3C", emoji: "🛒" },
  meijer:        { bg: "#CC0000", emoji: "🏬" },
  "h-e-b":       { bg: "#CC0000", emoji: "⭐" },
  safeway:       { bg: "#CC0000", emoji: "🛒" },
  "macy":        { bg: "#CC0000", emoji: "🏬" },
  saks:          { bg: "#1a1a1a", emoji: "👜" },
  nordstrom:     { bg: "#333333", emoji: "👗" },
  bloomingdale:  { bg: "#555555", emoji: "🛍️" },
  "best buy":    { bg: "#003B8E", emoji: "📺" },
  cvs:           { bg: "#CC0000", emoji: "💊" },
  walgreens:     { bg: "#E31837", emoji: "💊" },
};

function getBrandConfig(name: string) {
  const lower = name.toLowerCase();
  for (const [brand, config] of Object.entries(BRAND_CONFIG)) {
    if (lower.includes(brand)) return config;
  }
  return { bg: "#4F46E5", emoji: "🏪" };
}

function getBrandInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getTodayHours(place: Place): string {
  const hours = place.currentOpeningHours || place.regularOpeningHours;
  if (!hours?.weekdayDescriptions?.length) return "Hours unavailable";
  const dayIndex = new Date().getDay();
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

  // Status label + color
  let statusLabel = "—";
  let statusBg = "bg-gray-100";
  let statusText = "text-gray-500";
  if (!isOperational) {
    statusLabel = "Permanently Closed";
    statusBg = "bg-gray-100";
    statusText = "text-gray-400";
  } else if (isOpen === true) {
    statusLabel = "Open Now";
    statusBg = "bg-[#16A34A]";
    statusText = "text-white";
  } else if (isOpen === false) {
    statusLabel = "Closed";
    statusBg = "bg-gray-200";
    statusText = "text-gray-500";
  }

  return (
    <div
      className="bg-white rounded-2xl flex items-stretch overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      {/* Brand color strip + logo */}
      <div
        className="w-24 flex-shrink-0 flex flex-col items-center justify-center gap-1.5 py-5"
        style={{ backgroundColor: brand.bg }}
      >
        <span className="text-4xl">{brand.emoji}</span>
        <span className="text-white text-[11px] font-bold tracking-wide opacity-90">
          {getBrandInitials(place.displayName.text)}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-5 min-w-0">
        {/* Store name + status badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-[#111827] leading-tight" style={{ fontSize: 18 }}>
            {place.displayName.text}
          </h3>
          <span
            className={cn(
              "flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full mt-0.5",
              statusBg, statusText
            )}
          >
            {statusLabel}
          </span>
        </div>

        {/* Hours — big, readable */}
        <p className="text-[#111827] font-medium mb-1" style={{ fontSize: 16 }}>
          {hoursText}
        </p>

        {/* Address + distance */}
        <p className="text-[#6B7280] text-sm truncate">
          {place.formattedAddress}
          {place.distance !== undefined && (
            <span className="font-semibold text-[#111827] ml-1">
              · {formatDistance(place.distance)}
            </span>
          )}
        </p>

        {/* Navigate button */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-colors"
        >
          <Navigation size={15} />
          Directions
        </a>
      </div>
    </div>
  );
}
