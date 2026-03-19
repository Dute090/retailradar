"use client";

import { Place } from "@/lib/types";
import { formatDistance } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";

interface StoreCardProps {
  place: Place;
}

const BRAND_LOGOS: Record<string, string> = {
  walmart:       "https://www.google.com/s2/favicons?domain=walmart.com&sz=64",
  target:        "https://www.google.com/s2/favicons?domain=target.com&sz=64",
  costco:        "https://www.google.com/s2/favicons?domain=costco.com&sz=64",
  kroger:        "https://www.google.com/s2/favicons?domain=kroger.com&sz=64",
  "whole foods": "https://www.google.com/s2/favicons?domain=wholefoods.com&sz=64",
  aldi:          "https://www.google.com/s2/favicons?domain=aldi.us&sz=64",
  "trader joe":  "https://www.google.com/s2/favicons?domain=traderjoes.com&sz=64",
  publix:        "https://www.google.com/s2/favicons?domain=publix.com&sz=64",
  "h-e-b":       "https://www.google.com/s2/favicons?domain=heb.com&sz=64",
  safeway:       "https://www.google.com/s2/favicons?domain=safeway.com&sz=64",
  macy:          "https://www.google.com/s2/favicons?domain=macys.com&sz=64",
  saks:          "https://www.google.com/s2/favicons?domain=saksfifthavenue.com&sz=64",
  nordstrom:     "https://www.google.com/s2/favicons?domain=nordstrom.com&sz=64",
  bloomingdale:  "https://www.google.com/s2/favicons?domain=bloomingdales.com&sz=64",
  "best buy":    "https://www.google.com/s2/favicons?domain=bestbuy.com&sz=64",
  cvs:           "https://www.google.com/s2/favicons?domain=cvs.com&sz=64",
  walgreens:     "https://www.google.com/s2/favicons?domain=walgreens.com&sz=64",
  sprouts:       "https://www.google.com/s2/favicons?domain=sprouts.com&sz=64",
  wegmans:       "https://www.google.com/s2/favicons?domain=wegmans.com&sz=64",
};

function getLogo(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(BRAND_LOGOS)) {
    if (lower.includes(key)) return url;
  }
  return null;
}

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
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
  const logo = getLogo(place.displayName.text);
  const hoursText = getTodayHours(place);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.formattedAddress
  )}&destination_place_id=${place.id}`;

  const open = isOperational && isOpen === true;
  const closed = !isOperational || isOpen === false;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-4 py-4 bg-white active:bg-gray-50 transition-colors"
    >
      {/* Logo */}
      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {logo ? (
          <Image
            src={logo}
            alt={place.displayName.text}
            width={32}
            height={32}
            className="object-contain"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = "none";
              const p = el.parentElement;
              if (p) p.innerHTML = `<span style="font-size:13px;font-weight:700;color:#9CA3AF">${getInitials(place.displayName.text)}</span>`;
            }}
          />
        ) : (
          <span className="text-[13px] font-bold text-gray-400">{getInitials(place.displayName.text)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-[15px] leading-snug truncate">
          {place.displayName.text}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          {open && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
          <span className={`text-[13px] ${open ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
            {open ? "Open" : closed ? "Closed" : "—"}
          </span>
          <span className="text-gray-300 text-[13px]">·</span>
          <span className="text-[13px] text-gray-400 truncate">{hoursText}</span>
        </div>

        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={11} className="text-gray-300 flex-shrink-0" />
          <p className="text-[13px] text-gray-400 truncate">
            {place.formattedAddress}
            {place.distance !== undefined && (
              <span className="text-gray-500 font-medium ml-1">· {formatDistance(place.distance)}</span>
            )}
          </p>
        </div>
      </div>

      {/* Arrow */}
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="flex-shrink-0 text-gray-300">
        <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}
