import { NextResponse } from 'next/server';

// Helper to calculate straight-line distance in km (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
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

    // 1. Calculate distance (fallback to straight line * 1.3 if ORS not available)
    const straightLine = calculateDistance(pickup.lat, pickup.lng, drop.lat, drop.lng);
    const distanceKm = straightLine * 1.3; // Approximate routing distance

    // 2. Fetch Tariff Rules (Mocking DB call for now since we don't have Supabase connected)
    // In real app: const { data: tariff } = await supabase.from('tariff_rules').select('*').eq('city', city)...
    const tariff = {
      base_fare: 25.0,
      base_km: 1.0,
      per_km: 15.0,
    };

    // 3. Fetch Comparable Reports
    // Mocking 5 community reports with roughly 18-20 Rs/km
    const communityAvgPerKm = 19.0;
    const reportCount = 12;

    // 4. Calculate Reasonable Range
    const tariffTotal = tariff.base_fare + Math.max(0, distanceKm - tariff.base_km) * tariff.per_km;
    const communityTotal = distanceKm * communityAvgPerKm;

    // Range: 25th to 75th percentile (simulated)
    const rangeLow = Math.round(communityTotal * 0.9);
    const rangeHigh = Math.round(communityTotal * 1.15);
    
    // 5. Verdict Logic
    let verdict = 'Fair';
    if (qPrice > rangeHigh * 1.40) {
      verdict = 'Potentially Overpriced';
    } else if (qPrice > rangeHigh * 1.10) {
      verdict = 'Needs Review';
    }

    // 6. Confidence Score
    // Sample size: up to 40 pts (5 per report, max 8)
    const sizeScore = Math.min(40, reportCount * 5);
    // Freshness: 15 pts (simulated median 45 days)
    const freshnessScore = 15;
    // Source quality: 20 pts (tariff exists + evidence)
    const sourceScore = 20;
    // Agreement: 8 pts
    const agreementScore = 8;
    
    const confidence = sizeScore + freshnessScore + sourceScore + agreementScore;

    const factors = [
      `Distance: ${distanceKm.toFixed(1)} km (approximate)`,
      `Time: Daytime`,
      `${reportCount} recent community reports`,
      `Official tariff: ~Rs ${Math.round(tariffTotal)}`
    ];

    const explanation = `Rs ${qPrice} is ${verdict === 'Fair' ? 'in line with' : verdict === 'Needs Review' ? 'slightly above' : 'well above'} what recent travellers reported for a similar trip (Rs ${rangeLow} to Rs ${rangeHigh}, from ${reportCount} reports). The official daytime tariff works out to about Rs ${Math.round(tariffTotal)}.`;

    return NextResponse.json({
      verdict,
      reasonableRange: [rangeLow, rangeHigh],
      confidence,
      factors,
      explanation
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
