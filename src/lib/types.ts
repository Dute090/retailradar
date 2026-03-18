export interface Place {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  businessStatus: string;
  currentOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
    periods?: Array<{
      open: { day: number; hour: number; minute: number };
      close: { day: number; hour: number; minute: number };
    }>;
  };
  regularOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions: string[];
  };
  types: string[];
  photos?: { name: string }[];
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  distance?: number; // computed client-side
}

export interface NearbyResponse {
  places: Place[];
}
