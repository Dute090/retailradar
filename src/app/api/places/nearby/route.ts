import { NextRequest, NextResponse } from "next/server";

const PLACES_API_BASE = "https://places.googleapis.com/v1";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.currentOpeningHours",
  "places.regularOpeningHours",
  "places.businessStatus",
  "places.types",
  "places.photos",
].join(",");

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, radius = 8000 } = await req.json();

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const body = {
      includedTypes: ["supermarket", "grocery_or_supermarket", "department_store"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius,
        },
      },
    };

    const res = await fetch(`${PLACES_API_BASE}/places:searchNearby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Places API error:", err);
      return NextResponse.json({ error: "Places API error" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
