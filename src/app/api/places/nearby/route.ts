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
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.websiteUri",
  "places.nationalPhoneNumber",
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
      includedTypes: ["supermarket", "department_store", "grocery_store"],
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
      return NextResponse.json({ error: "Places API error", detail: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Places API fetch failed, returning demo data:", e);
    return NextResponse.json(getDemoData());
  }
}

function getDemoData() {
  return {
    places: [
      { id: "demo1", displayName: { text: "Whole Foods Market" }, formattedAddress: "10 Columbus Circle, New York, NY", location: { latitude: 40.7685, longitude: -73.9822 }, businessStatus: "OPERATIONAL", currentOpeningHours: { openNow: true }, rating: 4.2, userRatingCount: 1200 },
      { id: "demo2", displayName: { text: "Trader Joe's" }, formattedAddress: "675 6th Ave, New York, NY", location: { latitude: 40.7411, longitude: -73.9937 }, businessStatus: "OPERATIONAL", currentOpeningHours: { openNow: true }, rating: 4.5, userRatingCount: 2300 },
      { id: "demo3", displayName: { text: "Target" }, formattedAddress: "237 W 42nd St, New York, NY", location: { latitude: 40.7561, longitude: -73.9894 }, businessStatus: "OPERATIONAL", currentOpeningHours: { openNow: true }, rating: 4.0, userRatingCount: 890 },
      { id: "demo4", displayName: { text: "Macy's" }, formattedAddress: "151 W 34th St, New York, NY", location: { latitude: 40.7508, longitude: -73.9886 }, businessStatus: "OPERATIONAL", currentOpeningHours: { openNow: false }, rating: 4.1, userRatingCount: 3400 },
      { id: "demo5", displayName: { text: "Costco Wholesale" }, formattedAddress: "976 3rd Ave, Brooklyn, NY", location: { latitude: 40.6782, longitude: -73.9442 }, businessStatus: "OPERATIONAL", currentOpeningHours: { openNow: true }, rating: 4.4, userRatingCount: 5600 },
    ],
    _demo: true,
  };
}
