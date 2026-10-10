"use client";

import { useState } from "react";
import { Camera, Send } from "lucide-react";

export default function ReportPage() {
  const [city, setCity] = useState("Guwahati");
  const [serviceType, setServiceType] = useState("auto");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="container max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Report Submitted</h2>
        <p className="text-slate-600 mb-6">
          Thank you! Your report has been submitted and is pending review by our moderators. Once approved, it will help other travellers.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Report an Experience</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Your reports are fed directly into our <strong>Location-based Tourist Trap Database</strong>. 
          By reporting overcharging, you help our AI identify scam hotspots and protect future travellers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <select 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
            >
              <option value="Guwahati">Guwahati</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Service</label>
            <select 
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent"
            >
              <option value="auto">Auto-rickshaw</option>
              <option value="taxi">Taxi</option>
              <option value="app_cab">App Cab</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Point</label>
            <input required type="text" placeholder="e.g. Airport" className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Drop Point</label>
            <input required type="text" placeholder="e.g. Paltan Bazaar" className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Quoted Price (Rs)</label>
            <input required type="number" placeholder="What did they ask for?" className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Actual Paid Price (Rs)</label>
            <input type="number" placeholder="Optional. What did you pay?" className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Evidence (Optional)</label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Click to upload a photo of a meter, bill, or rate card</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Notes (No names or phone numbers!)</label>
          <textarea 
            rows={3} 
            placeholder="e.g. Demanded extra for luggage" 
            className="w-full p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-transparent resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Report</>}
        </button>
      </form>
    </div>
  );
}
