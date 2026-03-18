"use client";

import { Place } from "@/lib/types";
import { formatDistance } from "@/lib/utils";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";

interface StoreCardProps {
  place: Place;
}

const BRANDS: Record<string, { color: string; logo: string }> = {
  walmart:       { color: "#0071CE", logo: "https://logo.clearbit.com/walmart.com" },
  target:        { color: "#CC0000", logo: "https://logo.clearbit.com/target.com" },
  costco:        { color: "#005DAA", logo: "https://logo.clearbit.com/costco.com" },
  kroger:        { color: "#2563EB", logo: "https://logo.clearbit.com/kroger.com" },
  "whole foods": { color: "#00674B", logo: "https://logo.clearbit.com/wholefoods.com" },
  aldi:          { color: "#1A3E6F", logo: "https://logo.clearbit.com/aldi.us" },
  "trader joe":  { color: "#B22222", logo: "https://logo.clearbit.com/traderjoes.com" },
  publix:        { color: "#1A7A3C", logo: "https://logo.clearbit.com/publix.com" },
  "h-e-b":       { color: "#CC0000", logo: "https://logo.clearbit.com/heb.com" },
  safeway:       { color: "#CC0000", logo: "https://logo.clearbit.com/safeway.com" },
  macy:          { color: "#CC0000", logo: "https://logo.clearbit.com/macys.com" },
  saks:          { color: "#1a1a1a", logo: "https://logo.clearbit.com/saksfifthavenue.com" },
  nordstrom:     { color: "#333",    logo: "https://logo.clearbit.com/nordstrom.com" },
  bloomingdale:  { color: "#555",    logo: "https://logo.clearbit.com/bloomingdales.com" },
  "best buy":    { color: "#003B8E", logo: "https://logo.clearbit.com/bestbuy.com" },
  cvs:           { color: "#CC0000", logo: "https://logo.clearbit.com/cvs.com" },
  walgreens:     { color: "#E31837", logo: "https://logo.clearbit.com/walgreens.com" },
  sprouts:       { color: "#4CAF50", logo: "https://logo.clearbit.com/sprouts.com" },
  wegmans:       { color: "#006341", logo: "https://logo.clearbit.com/wegmans.com" },
  "food lion":   { color: "#E31837", logo: "https://logo.clearbit.com/foodlion.com" },
};

function getBrand(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(BRANDS)) {
    if (lower.includes(key)) return { ...val, initials: name.slice(0, 2).toUpperCase() };
  }
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return {
    color: `hsl(${hue}, 55%, 40%)`,
    logo: null,
    initials: name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
  };
}

function getTodayHours(place: Place): string {
  const hours = place.currentOpeningHours || place.regularOpeningHours;
  if (!hours?.weekdayDescriptions?.length) return "Hours unavailable";
  const dayIndex = new Date().getDay();
  const idx = dayIndex === 0 ? 6 : dayIndex - 1;
  return hours.weekdayDescriptions[idx]?.split(": ")[1] || "Hours unavailable";
}

export function StoreCard({ place }: StoreCardProps) {
  const isOpen = place.currentOpeningHours?.openNow ?? place.regularOpeningHours?.openNow;
  const isOperational = place.businessStatus === "OPERATIONAL";
  const brand = getBrand(place.displayName.text);
  const hoursText = getTodayHours(place);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.formattedAddress
  )}&destination_place_id=${place.id}`;

  const statusDot = !isOperational ? "bg-gray-300" : isOpen === true ? "bg-emerald-500" : "bg-gray-300";
  const statusLabel = !isOperational ? "Permanently closed" : isOpen === true ? "Open now" : isOpen === false ? "Closed" : "Hours unknown";
  const statusColor = isOpen === true && isOperational ? "text-emerald-600" : "text-gray-400";

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl overflow-hidden active:scale-[0.985] transition-transform"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)" }}
    >
      {/* Accent top bar */}
      <div className="h-1 w-full" style={{ backgroundColor: brand.color }} />

      <div className="p-4 flex gap-3.5 items-start">
        {/* Brand logo */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: brand.logo ? "#fff" : brand.color, border: brand.logo ? "1.5px solid #F0F0F0" : "none" }}
        >
          {brand.logo ? (
            <Image
              src={brand.logo}
              alt={place.displayName.text}
              width={40}
              height={40}
              className="object-contain"
              onError={(e) => {
                // fallback to initials on error
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.style.backgroundColor = brand.color;
                  parent.style.border = "none";
                  parent.innerHTML = `<span style="color:#fff;font-weight:800;font-size:16px">${brand.initials}</span>`;
                }
              }}
            />
          ) : (
            <span className="text-white font-black text-base">{brand.initials}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Store name */}
          <h3 className="font-bold text-gray-900 leading-snug" style={{ fontSize: 17 }}>
            {place.displayName.text}
          </h3>

          {/* Status */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />
            <span className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</span>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-1.5 mt-1">
            <Clock size={12} className="text-gray-300 flex-shrink-0" />
            <span className="text-sm text-gray-500">{hoursText}</span>
          </div>

          {/* Address + distance */}
          <div className="flex items-start gap-1.5 mt-1">
            <MapPin size={12} className="text-gray-300 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-400 leading-snug">
              {place.formattedAddress}
              {place.distance !== undefined && (
                <span className="font-semibold text-gray-600 ml-1">· {formatDistance(place.distance)}</span>
              )}
            </p>
          </div>
        </div>

        <ChevronRight size={17} className="text-gray-300 flex-shrink-0 mt-1" />
      </div>
    </a>
  );
}
