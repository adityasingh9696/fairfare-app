export interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  complaints: number;
  description: string;
  city: string;
}

export const SCAM_HOTSPOTS: Hotspot[] = [
  // Guwahati
  {
    id: "ghy-kamakhya",
    name: "Kamakhya Temple Base",
    city: "Guwahati",
    lat: 26.1663,
    lng: 91.7058,
    radius: 400,
    complaints: 142,
    description: "Frequent reports of auto drivers quoting 3x fares for temple trips."
  },
  {
    id: "ghy-paltan",
    name: "Paltan Bazaar Railway Station",
    city: "Guwahati",
    lat: 26.1793,
    lng: 91.7451,
    radius: 500,
    complaints: 289,
    description: "High risk of pre-paid taxi scams and refusing meter fares."
  },
  {
    id: "ghy-isbt",
    name: "ISBT Guwahati",
    city: "Guwahati",
    lat: 26.1264,
    lng: 91.7371,
    radius: 400,
    complaints: 96,
    description: "Aggressive touts overcharging for late-night arrivals."
  },
  
  // Shillong
  {
    id: "shg-police-bazaar",
    name: "Police Bazaar Taxi Stand",
    city: "Shillong",
    lat: 25.5788,
    lng: 91.8833,
    radius: 300,
    complaints: 112,
    description: "Tourists frequently overcharged for local sightseeing points."
  },
  {
    id: "shg-elephant-falls",
    name: "Elephant Falls Entry",
    city: "Shillong",
    lat: 25.5348,
    lng: 91.8227,
    radius: 200,
    complaints: 45,
    description: "Shared taxis charging private rates to tourists."
  },

  // Delhi (For global testing)
  {
    id: "del-ndls",
    name: "New Delhi Railway Station",
    city: "Delhi",
    lat: 28.6429,
    lng: 77.2191,
    radius: 600,
    complaints: 840,
    description: "Infamous for fake tourist information centers and massive overcharging."
  }
];

/**
 * Helper to check if a lat/lng falls within any hotspot
 */
export function getIntersectingHotspot(lat: number, lng: number): Hotspot | null {
  for (const h of SCAM_HOTSPOTS) {
    // Rough distance calculation using Haversine
    const R = 6371e3; // metres
    const φ1 = lat * Math.PI/180; // φ, λ in radians
    const φ2 = h.lat * Math.PI/180;
    const Δφ = (h.lat - lat) * Math.PI/180;
    const Δλ = (h.lng - lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres

    if (d <= h.radius) {
      return h;
    }
  }
  return null;
}
