"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, Lock, Mail, ArrowRight, MapPin, Shield, TrendingUp } from "lucide-react";
import Image from "next/image";

const FEATURES = [
  { icon: MapPin,     title: "Live Route Pricing", desc: "Pin pickup & drop on a real map. We calculate the exact distance instantly." },
  { icon: Shield,     title: "Overcharge Detection", desc: "Compare against official tariffs and 100+ verified community reports." },
  { icon: TrendingUp, title: "Confidence Scoring",  desc: "Every result shows how sure we are, what data we used, and its limits." },
];

export default function LoginPage() {
  const [role, setRole]       = useState<"traveller" | "admin">("traveller");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router    = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(role);
      router.push(role === "admin" ? "/moderation" : "/check");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: hero image ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Full bleed background image */}
        <Image
          src="/city_night_hero.png"
          alt="Guwahati city at night"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-indigo-950/60 to-slate-950/80 z-10" />

        {/* Content over image */}
        <div className="relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <span className="font-display font-bold text-2xl text-white">FairFare</span>
          </div>
        </div>

        <div className="relative z-20">
          <div className="badge-indigo inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block animate-pulse" />
            AI-Powered · Global · 2026
          </div>
          <h2 className="font-display font-black text-4xl xl:text-5xl text-white leading-tight mb-4">
            Don't get trapped<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              by unfair fares.
            </span>
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-md">
            Real-time price verification using official tariffs and verified community reports from global travellers.
          </p>

          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-4 glass rounded-xl p-4 border border-white/5">
                <div className="w-9 h-9 rounded-lg badge-indigo flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom auto-rickshaw image strip */}
        <div className="absolute bottom-0 left-0 right-0 h-48 z-10 overflow-hidden">
          <Image
            src="/auto_rickshaw_hero.png"
            alt="Auto-rickshaw"
            fill
            className="object-cover object-bottom opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
      </div>

      {/* ── Right panel: login form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Subtle glow */}
        <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-700 ${role === "admin" ? "bg-purple-500" : "bg-indigo-500"}`}
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white">FairFare</span>
          </div>

          <div className="mb-8 anim-up">
            <h1 className="font-display font-black text-3xl text-white mb-2">Sign in</h1>
            <p className="text-slate-400">Choose your role and enter your credentials.</p>
          </div>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-3 mb-8 anim-up-1">
            {(["traveller", "admin"] as const).map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-2 py-5 rounded-2xl border transition-all duration-200 ${
                  role === r
                    ? r === "admin"
                      ? "bg-purple-600/20 border-purple-500/50 text-white shadow-lg shadow-purple-500/10"
                      : "bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10"
                    : "border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
                }`}>
                {r === "traveller" ? <User className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
                <span className="font-semibold text-sm capitalize">{r === "admin" ? "Moderator" : "Traveller"}</span>
                <span className="text-xs opacity-50">{r === "admin" ? "Review reports" : "Check fares"}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5 anim-up-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className="inp pl-10" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="inp pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl badge-indigo">
              <span className="text-base">💡</span>
              <p className="text-xs text-indigo-300 leading-relaxed">
                <span className="font-semibold">Demo mode:</span> Any email & password works instantly.
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full h-12 flex items-center justify-center gap-2 anim-up-3">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign in as {role === "admin" ? "Moderator" : "Traveller"}</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-8 anim-up-3">
            By continuing, you agree to our community standards of honest reporting.
          </p>
        </div>
      </div>
    </div>
  );
}
