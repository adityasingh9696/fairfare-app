"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertOctagon, Clock, MapPin, Car, ShieldAlert, Search, BarChart2, Users, TrendingUp } from "lucide-react";

const REPORTS = [
  { id: 1, route: "Airport → Paltan Bazaar", service: "Auto-rickshaw", distance: "22 km", quoted: 800, range: "450–550", status: "pending", time: "10 min ago", tags: ["Overcharge"], note: "Driver refused meter, demanded ₹800 fixed." },
  { id: 2, route: "Railway Station → Kamakhya", service: "App Cab", distance: "8.5 km", quoted: 350, range: "180–220", status: "pending", time: "1 hr ago", tags: ["Detour", "Hidden Fee"], note: "Took a longer route and added luggage charges at end." },
  { id: 3, route: "ISBT → Ganeshguri", service: "Taxi", distance: "11 km", quoted: 250, range: "240–280", status: "approved", time: "2 days ago", tags: [], note: "Reasonable price, no issues." },
  { id: 4, route: "Paltan Bazaar → Zoo", service: "Auto-rickshaw", distance: "5 km", quoted: 1500, range: "100–140", status: "flagged", time: "5 hrs ago", tags: ["Extreme Overcharge"], note: "Demanded ₹1500, got aggressive when questioned." },
  { id: 5, route: "Zoo → Airport", service: "Taxi", distance: "20 km", quoted: 600, range: "500–620", status: "approved", time: "3 days ago", tags: [], note: "Slightly high but within range. Had extra luggage." },
];

const STATS = [
  { label: "Reports Today", value: "14", icon: BarChart2, color: "text-indigo-400", bg: "bg-indigo-500 bg-opacity-10" },
  { label: "Active Contributors", value: "89", icon: Users, color: "text-purple-400", bg: "bg-purple-500 bg-opacity-10" },
  { label: "Avg Confidence", value: "78%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500 bg-opacity-10" },
];

const TABS = [
  { id: "pending", label: "Pending Review", icon: Clock, activeClass: "bg-indigo-600 text-white" },
  { id: "approved", label: "Approved", icon: CheckCircle, activeClass: "bg-emerald-600 text-white" },
  { id: "flagged", label: "Flagged", icon: ShieldAlert, activeClass: "bg-rose-600 text-white" },
] as const;

type Tab = typeof TABS[number]["id"];

export default function ModerationPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pending");
  const [reports, setReports] = useState(REPORTS);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (role !== "admin") router.push("/login");
  }, [role, router]);

  if (!mounted || role !== "admin") return null;

  const move = (id: number, status: string) =>
    setReports(r => r.map(x => x.id === id ? { ...x, status } : x));

  const visible = reports.filter(r =>
    r.status === tab &&
    (search === "" || r.route.toLowerCase().includes(search.toLowerCase()))
  );

  const count = (s: string) => reports.filter(r => r.status === s).length;

  return (
    <div className="py-8 pb-20">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white mb-1">
            Moderator <span className="text-purple-400">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm">Review reports and keep the data clean and trustworthy.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search routes..."
              className="pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 bg-opacity-60 border border-white border-opacity-10 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:border-opacity-50 w-56"
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className="glass rounded-xl p-4 flex items-center gap-4 border border-white border-opacity-5">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="font-display font-black text-2xl text-white leading-none">{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 glass rounded-xl mb-6 w-fit border border-white border-opacity-5">
        {TABS.map(t => {
          const c = count(t.id);
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                active ? t.activeClass + " shadow-lg" : "text-slate-400 hover:text-white"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? "bg-white bg-opacity-20" : "bg-white bg-opacity-5"}`}>
                {c}
              </span>
            </button>
          );
        })}
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 gap-5 tab-content">
        {visible.length === 0 ? (
          <div className="col-span-2 py-20 glass rounded-2xl flex flex-col items-center text-center border border-white border-opacity-5">
            <CheckCircle className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">No reports here</p>
            <p className="text-slate-600 text-sm">You're all caught up!</p>
          </div>
        ) : visible.map(r => (
          <div key={r.id} className="glass-strong rounded-2xl overflow-hidden border border-white border-opacity-5 hover:border-white hover:border-opacity-10 transition-colors flex flex-col">
            {/* Color accent strip */}
            <div className={`h-1 w-full ${tab === "pending" ? "bg-gradient-to-r from-indigo-500 to-purple-500" : tab === "approved" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-rose-500 to-red-500"}`} />

            <div className="p-5 flex-1 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500 bg-opacity-10 flex items-center justify-center flex-shrink-0 border border-indigo-500 border-opacity-20">
                    <Car className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{r.route}</h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{r.distance} · {r.service}
                    </p>
                  </div>
                </div>
                <span className="text-slate-600 text-xs whitespace-nowrap">{r.time}</span>
              </div>

              {/* Price comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 bg-opacity-50 border border-white border-opacity-5">
                  <p className="text-slate-500 text-xs mb-1">Quoted</p>
                  <p className="font-display font-black text-white text-xl">₹{r.quoted}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 bg-opacity-50 border border-white border-opacity-5">
                  <p className="text-slate-500 text-xs mb-1">Our Range</p>
                  <p className="font-display font-bold text-slate-300 text-xl">₹{r.range}</p>
                </div>
              </div>

              {/* Tags */}
              {r.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {r.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500 bg-opacity-10 text-amber-400 border border-amber-500 border-opacity-20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Note */}
              <p className="text-slate-400 text-sm italic border-l-2 border-slate-700 pl-3 flex-1">"{r.note}"</p>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-white border-opacity-5">
                {tab !== "approved" && (
                  <button onClick={() => move(r.id, "approved")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 bg-opacity-10 text-emerald-400 hover:bg-opacity-20 border border-emerald-500 border-opacity-20 text-sm font-medium transition-colors">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                )}
                {tab !== "flagged" && (
                  <button onClick={() => move(r.id, "flagged")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-500 bg-opacity-10 text-rose-400 hover:bg-opacity-20 border border-rose-500 border-opacity-20 text-sm font-medium transition-colors">
                    <AlertOctagon className="w-4 h-4" /> Flag
                  </button>
                )}
                {tab !== "pending" && (
                  <button onClick={() => move(r.id, "pending")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white bg-opacity-5 text-slate-400 hover:bg-opacity-10 border border-white border-opacity-5 text-sm font-medium transition-colors">
                    <Clock className="w-4 h-4" /> Re-queue
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
