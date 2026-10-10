"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { LogOut, User, ShieldCheck } from "lucide-react";

export default function HeaderNav() {
  const { role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-white border-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg group-hover:shadow-indigo-500 group-hover:shadow-opacity-40 transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl text-white">
              Fair<span className="text-indigo-400">Fare</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Check Quote
            </Link>
            <Link href="/reports/new" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Report
            </Link>
            <Link href="/community" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Community
            </Link>
            {role === "admin" && (
              <Link href="/moderation" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-4">
            {!role ? (
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-indigo-500 hover:shadow-opacity-30"
              >
                Sign In
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm text-slate-300">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="capitalize font-medium">{role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500 hover:bg-opacity-10 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
