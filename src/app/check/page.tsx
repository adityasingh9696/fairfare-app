"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Car, CheckCircle2, AlertTriangle, XCircle, Navigation,
  Info, ChevronRight, Sparkles, Clock, FileText, IndianRupee
} from "lucide-react";
import type { LatLng } from "leaflet";
import LocationSearch from "@/components/LocationSearch";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const VERDICT = {
  "Fair":                 { icon: CheckCircle2,  grad: "from-emerald-500 to-teal-600",  badge: "badge-emerald" },
  "Needs Review":         { icon: AlertTriangle, grad: "from-amber-500 to-orange-500",  badge: "badge-amber"   },
  "Potentially Overpriced": { icon: XCircle,     grad: "from-rose-500 to-red-600",      badge: "badge-rose"    },
};

export default function CheckPage() {
  const { role } = useAuth();
  const router   = useRouter();
  const [city, setCity]             = useState("Guwahati");
  const [service, setService]       = useState("auto");
  const [price, setPrice]           = useState("");
  const [pickup, setPickup]         = useState<LatLng | null>(null);
  const [pickupName, setPickupName] = useState("");
  const [drop, setDrop]             = useState<LatLng | null>(null);
  const [dropName, setDropName]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<any>(null);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!role) router.push("/login");
  }, [role, router]);

  if (!mounted || !role) return null;

  const handlePickupChange = (name: string, latlng: { lat: number; lng: number } | null) => {
    setPickupName(name);
    if (latlng) setPickup(latlng as LatLng);
    else setPickup(null);
  };

  const handleDropChange = (name: string, latlng: { lat: number; lng: number } | null) => {
    setDropName(name);
    if (latlng) setDrop(latlng as LatLng);
    else setDrop(null);
  };

  const onMapPickup = (latlng: LatLng | null) => {
    setPickup(latlng);
    if (latlng) setPickupName("Pinned Location");
    else setPickupName("");
  };

  const onMapDrop = (latlng: LatLng | null) => {
    setDrop(latlng);
    if (latlng) setDropName("Pinned Location");
    else setDropName("");
  };

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop) return alert("Please set both pickup and drop locations.");
    if (!price)           return alert("Enter the quoted price.");
    setLoading(true);
    try {
      const r = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, serviceType: service, pickup, drop, quotedPrice: price }),
      });
      setResult(await r.json());
    } catch { alert("Something went wrong. Try again."); }
    finally   { setLoading(false); }
  };

  const vc = result ? VERDICT[result.verdict as keyof typeof VERDICT] : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between z-10 relative shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <span className="font-display font-bold text-lg text-white">FairFare</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-6">
          <a href="/check" className="text-indigo-400 text-sm font-semibold border-b border-indigo-400 pb-0.5">Check</a>
          <a href="/reports/new" className="text-slate-400 hover:text-white text-sm transition-colors">Report</a>
          {role === "admin" && <a href="/moderation" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</a>}
          <button onClick={() => { router.push("/login"); }}
            className="px-4 py-1.5 rounded-lg badge-indigo text-xs font-semibold">
            {role === "admin" ? "Admin" : "Traveller"}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 relative h-full">
        {/* ── Left sidebar form ── */}
        <aside className="w-full lg:max-w-md xl:max-w-lg flex-shrink-0 border-r border-white/5 flex flex-col h-full overflow-y-auto bg-slate-950/50 backdrop-blur-md z-10">
          {/* Form header */}
          <div className="p-6 border-b border-white/5 shrink-0">
            <div className="inline-flex items-center gap-2 badge-indigo px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Verification
            </div>
            <h1 className="font-display font-black text-2xl text-white">Is this fare fair?</h1>
            <p className="text-slate-500 text-sm mt-1">Search locations or click on the map.</p>
          </div>

          <form onSubmit={check} className="flex flex-col gap-6 p-6 shrink-0">
            {/* City + Service */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">City</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="e.g. Mumbai"
                  className="inp"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service</label>
                <select value={service} onChange={e => setService(e.target.value)} className="inp">
                  <option value="auto">Auto-rickshaw</option>
                  <option value="taxi">Local Taxi</option>
                  <option value="app_cab">App Cab (Uber/Ola)</option>
                  <option value="rapido">Bike Taxi (Rapido)</option>
                  <option value="magic">Share Taxi (Magic)</option>
                </select>
              </div>
            </div>

            {/* Location Search Components */}
            <div className="flex flex-col gap-4 relative z-20">
              <LocationSearch 
                label="Pickup Location" 
                color="indigo" 
                value={pickupName} 
                cityContext={city}
                onChange={handlePickupChange} 
                placeholder="Search pickup..." 
              />
              <LocationSearch 
                label="Drop Location" 
                color="purple" 
                value={dropName} 
                cityContext={city}
                onChange={handleDropChange} 
                placeholder="Search destination..." 
              />
            </div>

            {/* Quoted price */}
            <div className="relative z-10">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quoted Price</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 flex items-center justify-center pointer-events-none">
                  <IndianRupee className="w-5 h-5" />
                </span>
                <input
                  type="number" value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="e.g. 350"
                  className="inp pl-12 h-14 text-2xl font-bold placeholder-slate-800"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary h-13 py-3.5 flex items-center justify-center gap-2 group relative z-10">
              {loading
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Analyzing route...</span></>
                : <><Car className="w-5 h-5" /><span className="font-bold">Verify This Quote</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              }
            </button>
          </form>

          {/* Result panel */}
          {result && vc && (
            <div className="mx-6 mb-6 rounded-2xl overflow-hidden border border-white/5 glass-card anim-up relative z-10 shrink-0">
              <div className={`bg-gradient-to-r ${vc.grad} p-5`}>
                <div className="flex items-center gap-3">
                  <vc.icon className="w-7 h-7 text-white" />
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-widest">Verdict</p>
                    <h2 className="font-display font-black text-2xl text-white">{result.verdict}</h2>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Range */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Reasonable Range</p>
                    <p className="font-display font-black text-3xl text-white flex items-center">
                      <IndianRupee className="w-6 h-6 mr-1" />{result.reasonableRange[0]}
                      <span className="text-slate-600 mx-2 font-light">–</span>
                      <IndianRupee className="w-6 h-6 mr-1" />{result.reasonableRange[1]}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Quoted</p>
                    <p className="font-display font-bold text-2xl text-slate-300 flex items-center sm:justify-end">
                      <IndianRupee className="w-5 h-5 mr-1" />{price}
                    </p>
                  </div>
                </div>

                {/* Confidence bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500 uppercase tracking-wider">Confidence</span>
                    <span className="text-white font-bold">{result.confidence}% · {result.confidence >= 70 ? "High" : result.confidence >= 40 ? "Medium" : "Low"}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${
                      result.confidence >= 70 ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : result.confidence >= 40 ? "bg-gradient-to-r from-amber-400 to-amber-500"
                      : "bg-gradient-to-r from-rose-400 to-rose-500"}`}
                      style={{ width: `${result.confidence}%` }} />
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-indigo-500/50 pl-3">
                  {result.explanation}
                </p>

                {/* Factors */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Factors</p>
                  <ul className="space-y-1.5">
                    {result.factors.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Right: Full-screen map ── */}
        <div className="flex-1 relative w-full h-full bg-slate-900 z-0">
          <div className="absolute inset-0">
            <Map pickup={pickup} drop={drop} setPickup={onMapPickup} setDrop={onMapDrop} />
          </div>

          {/* Map overlay instructions */}
          {!pickup && !drop && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card rounded-xl px-5 py-3 flex items-center gap-3 border border-white/10 shadow-xl anim-up hidden lg:flex pointer-events-none">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <p className="text-sm text-slate-300 font-medium">Click the map or search to set your <span className="text-indigo-400">pickup</span>, then <span className="text-purple-400">drop</span></p>
            </div>
          )}
          {pickup && !drop && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card rounded-xl px-5 py-3 flex items-center gap-3 border border-purple-500/30 shadow-xl anim-up hidden lg:flex pointer-events-none">
              <Navigation className="w-4 h-4 text-purple-400" />
              <p className="text-sm text-slate-300 font-medium">Now click or search to set your <span className="text-purple-400">drop location</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
