export interface Place {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  businessStatus: string;
  currentOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  regularOpeningHours?: {
    weekdayDescriptions: string[];
  };
  types: string[];
  photos?: { name: string }[];
  distance?: number; // computed client-side
}

export interface NearbyResponse {
  places: Place[];
}
