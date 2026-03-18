"use client";

import { useState, useEffect } from "react";
import { Place } from "@/lib/types";

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; city?: string } | null>(null);

  const fetchPlaces = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/places/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      const withDistance = (data.places || []).map((p: Place) => ({
        ...p,
        distance: getDistanceMeters(lat, lng, p.location.latitude, p.location.longitude),
      }));
      withDistance.sort((a: Place, b: Place) => (a.distance ?? 0) - (b.distance ?? 0));
      setPlaces(withDistance);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // reverse geocode city name
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          const city = d.address?.city || d.address?.town || d.address?.county || "";
          const state = d.address?.state_code || d.address?.state || "";
          setLocation({ lat, lng, city: city ? `${city}${state ? ", " + state : ""}` : undefined });
        } catch {
          setLocation({ lat, lng });
        }
        fetchPlaces(lat, lng);
      },
      (err) => {
        setError("Location access denied. Please allow location access.");
        setLoading(false);
        console.error(err);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { places, loading, error, location, refetch: locate };
}
