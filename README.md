# 🚕 FairFare – Travel Trap Detector

**Don't get trapped by unfair fares.**
FairFare is an AI-powered travel companion built to protect tourists and locals from overpriced taxi, auto-rickshaw, and cab fares. By leveraging AI logic and real-world distance calculations, it provides instant verdicts on whether a quoted price is fair.

![FairFare Demo Screenshot](public/city_night_hero.png)

## 🌟 Key Features

* **🤖 AI-Powered Fare Verification**: Instantly calculates a reasonable price range based on pickup and drop locations, vehicle type, and local city baselines.
* **🗺️ Interactive Maps (OpenStreetMap)**: Fully integrated dark-themed Leaflet map. Click to drop pickup and destination pins, or use the search bar.
* **🔍 Smart Location Search**: Integrated with the Photon API (by Komoot) for highly forgiving, fuzzy autocomplete location search that understands context and typos.
* **👥 Dual-Role System**: 
  * **Traveller Mode**: Calculate fares, view AI verdicts, and report drivers who attempt to overcharge.
  * **Admin/Moderator Dashboard**: Review community reports of "travel traps" to warn future tourists about specific hotspots.
* **✨ Modern UI/UX**: Built with a sleek, glassmorphism design, micro-animations, and dynamic gradient indicators for instant visual feedback (Fair, Needs Review, Potentially Overpriced).

## 🛠️ Tech Stack

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (with custom global utilities and glassmorphism)
* **Mapping**: `react-leaflet` with OpenStreetMap tile layers
* **Geocoding Search**: Photon API (Komoot)
* **Icons**: `lucide-react`
* **Deployment**: [Vercel](https://vercel.com)

## 🚀 Getting Started Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityasingh9696/fairfare-app.git
   cd fairfare-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note**: If you see a map error during local development, this is a known interaction between Next.js Fast Refresh and Leaflet DOM manipulation. Simply press **F5 to refresh the page**.

## 🌐 Live Demo
The project is fully deployed and accessible here:  
**[fairfare-app-ijng.vercel.app](https://fairfare-app-ijng.vercel.app/)**

---
*Built for the Hackathon – Empowering safe and fair travel for everyone.*
