import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function getStatusInfo(isOpen: boolean | undefined, periods?: unknown[]) {
  if (isOpen === undefined) return { label: "Unknown", color: "text-gray-400", bg: "bg-gray-100" };
  if (isOpen) return { label: "Open Now", color: "text-green-700", bg: "bg-green-100" };
  return { label: "Closed", color: "text-red-600", bg: "bg-red-100" };
}
