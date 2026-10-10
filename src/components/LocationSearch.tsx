"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X, MapPin, Loader2 } from "lucide-react";

interface Suggestion {
  name: string;
  context: string;
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  label: string;
  color: "indigo" | "purple";
  value: string;
  cityContext: string;
  onChange: (name: string, latlng: { lat: number; lng: number } | null) => void;
  placeholder?: string;
}

export default function LocationSearch({ label, color, value, cityContext, onChange, placeholder }: LocationSearchProps) {
  const [query, setQuery]           = useState(value || "");
  const [suggestions, setSugs]      = useState<Suggestion[]>([]);
  const [loading, setLoading]       = useState(false);
  const [open, setOpen]             = useState(false);
  const debounceRef                 = useRef<NodeJS.Timeout | undefined>(undefined);
  const wrapRef                     = useRef<HTMLDivElement>(null);

  // Sync external value changes (like when clicking the map)
  useEffect(() => {
    if (value !== query) setQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = async (q: string) => {
    if (q.length < 2) { setSugs([]); return; }
    setLoading(true);
    try {
      // Use Photon API (Komoot) which has much better fuzzy autocomplete than raw Nominatim
      // Append city to query to help restrict results. Photon handles global queries well.
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q + " " + cityContext)}&limit=8`;
      const res = await fetch(url);
      const data = await res.json();
      
      const parsed: Suggestion[] = data.features.map((f: any) => {
        const props = f.properties;
        const name = props.name || props.street || props.city || "Unknown Location";
        // Build a nice context string (e.g. "Paltan Bazaar, Guwahati")
        const contextParts = [];
        if (props.district) contextParts.push(props.district);
        if (props.city && props.city !== name) contextParts.push(props.city);
        if (props.state && contextParts.length === 0) contextParts.push(props.state);

        return {
          name: name,
          context: contextParts.join(", "),
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        };
      });

      // Filter out duplicates (Photon sometimes returns multiple nodes for the same building)
      const unique = parsed.filter((v, i, a) => a.findIndex(t => (t.name === v.name && t.context === v.context)) === i);
      
      setSugs(unique);
      setOpen(true);
    } catch {
      setSugs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (val: string) => {
    setQuery(val);
    onChange(val, null); // reset latlng while typing to force a new selection
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const select = (s: Suggestion) => {
    setQuery(s.name);
    setSugs([]);
    setOpen(false);
    onChange(s.name, { lat: s.lat, lng: s.lng });
  };

  const clear = () => {
    setQuery("");
    setSugs([]);
    setOpen(false);
    onChange("", null);
  };

  const dotColor = color === "indigo" ? "#818cf8" : "#c084fc";

  return (
    <div className="relative" ref={wrapRef}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
        {label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder || `Type a place in ${cityContext}...`}
          className="inp pl-9 pr-8"
          style={{ fontSize: "0.875rem" }}
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 animate-spin" />}
        {!loading && query && (
          <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 glass-card rounded-xl overflow-hidden z-50 shadow-2xl border border-white/10 max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => select(s)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
            >
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: dotColor }} />
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{s.name}</p>
                {s.context && <p className="text-slate-500 text-xs truncate mt-0.5">{s.context}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.length > 1 && !loading && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 glass-card rounded-xl p-4 z-50 text-center text-sm text-slate-400">
          No places found. Try typing a broader area or clicking on the map.
        </div>
      )}
    </div>
  );
}
