import { NextResponse } from 'next/server';
import { getIntersectingHotspot } from '@/lib/hotspots';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK
// Note: Requires GEMINI_API_KEY in .env.local
const ai = new GoogleGenAI({}); 

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city, serviceType, pickup, drop, quotedPrice } = body;

    if (!pickup || !drop || !quotedPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const qPrice = parseFloat(quotedPrice);
    const straightLine = calculateDistance(pickup.lat, pickup.lng, drop.lat, drop.lng);
    const distanceKm = straightLine * 1.3; 

    // Community Intelligence Integration (Tourist Traps)
    const pickupHotspot = getIntersectingHotspot(pickup.lat, pickup.lng);
    const dropHotspot = getIntersectingHotspot(drop.lat, drop.lng);
    const activeHotspot = pickupHotspot || dropHotspot;

    let hotspotContext = "No known tourist traps nearby.";
    if (activeHotspot) {
      hotspotContext = `[CRITICAL COMMUNITY ALERT]: The route interacts with "${activeHotspot.name}", a known tourist trap with ${activeHotspot.complaints} recent community complaints. ${activeHotspot.description}. YOU MUST FACTOR THIS HIGH RISK INTO YOUR VERDICT AND EXPLANATION.`;
    }

    const prompt = `
      You are FairFare AI, an expert travel fare analyst. 
      Analyze the following trip quote:
      - City: ${city}
      - Vehicle Type: ${serviceType}
      - Approximate Distance: ${distanceKm.toFixed(2)} km
      - Quoted Price by driver: Rs ${qPrice}
      
      COMMUNITY INTELLIGENCE:
      ${hotspotContext}

      Task: 
      1. Determine the fair market price for this trip.
      2. Evaluate if the quoted price is fair.
      3. Return a JSON response exactly matching this structure (no markdown blocks, just raw JSON):
      {
        "verdict": "Fair" | "Needs Review" | "Potentially Overpriced",
        "reasonableRange": [lowPriceInteger, highPriceInteger],
        "confidence": integer between 0 and 100,
        "explanation": "A 2-sentence explanation of your reasoning, referencing community intelligence if relevant.",
        "factors": ["Factor 1", "Factor 2", "Factor 3"]
      }
    `;

    // If API key is missing, fallback to our mock logic so the hackathon demo doesn't crash
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, falling back to deterministic mock logic.");
      return generateMockResponse(qPrice, distanceKm, activeHotspot);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    if (!response.text) throw new Error("No response from AI");
    
    const parsed = JSON.parse(response.text);
    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fallback logic for when there is no API key configured
function generateMockResponse(qPrice: number, distanceKm: number, activeHotspot: any) {
  const communityAvgPerKm = 19.0;
  let communityTotal = distanceKm * communityAvgPerKm;
  
  if (activeHotspot) {
    communityTotal *= 0.8; // Lower the reasonable range slightly because we know touts overcharge here
  }

  const rangeLow = Math.round(communityTotal * 0.9);
  const rangeHigh = Math.round(communityTotal * 1.15);
  
  let verdict = 'Fair';
  if (qPrice > rangeHigh * 1.40) verdict = 'Potentially Overpriced';
  else if (qPrice > rangeHigh * 1.10) verdict = 'Needs Review';

  // Force verdict if in a hotspot and price is even slightly high
  if (activeHotspot && qPrice > rangeHigh * 1.05) {
    verdict = 'Potentially Overpriced';
  }

  let explanation = `Rs ${qPrice} is ${verdict === 'Fair' ? 'in line with' : verdict === 'Needs Review' ? 'slightly above' : 'well above'} what recent travellers reported for a similar trip (Rs ${rangeLow} to Rs ${rangeHigh}).`;
  
  if (activeHotspot) {
    explanation += ` WARNING: You are in ${activeHotspot.name}, a known tourist trap with ${activeHotspot.complaints} complaints!`;
  }

  return NextResponse.json({
    verdict,
    reasonableRange: [rangeLow, rangeHigh],
    confidence: activeHotspot ? 95 : 75,
    factors: [
      `Distance: ${distanceKm.toFixed(1)} km`,
      activeHotspot ? `⚠️ HIGH RISK: ${activeHotspot.name}` : `Area: Normal`,
      activeHotspot ? `Community: ${activeHotspot.complaints} recent scam reports` : `Community: Typical pricing`
    ],
    explanation
  });
}
