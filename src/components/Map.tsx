"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom markers
const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#4f46e5,#7c3aed);
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:3px solid white;
    box-shadow:0 4px 20px rgba(99,102,241,0.6);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

const dropIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;
    background:linear-gradient(135deg,#7c3aed,#db2777);
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    border:3px solid white;
    box-shadow:0 4px 20px rgba(168,85,247,0.6);
  "></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

interface Props {
  pickup: L.LatLng | null;
  drop:   L.LatLng | null;
  setPickup: (l: L.LatLng | null) => void;
  setDrop:   (l: L.LatLng | null) => void;
}

function Clicker({ pickup, setPickup, setDrop }: { pickup: L.LatLng | null; setPickup: (l: L.LatLng) => void; setDrop: (l: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (!pickup) setPickup(e.latlng);
      else         setDrop(e.latlng);
    },
  });
  return null;
}

function PanToPins({ pickup, drop }: { pickup: L.LatLng | null; drop: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (pickup && drop) {
      const bounds = L.latLngBounds([pickup, drop]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickup) {
      map.flyTo(pickup, 14, { duration: 1.5 });
    } else if (drop) {
      map.flyTo(drop, 14, { duration: 1.5 });
    }
  }, [pickup, drop, map]);
  return null;
}

export default function Map({ pickup, drop, setPickup, setDrop }: Props) {
  return (
    <MapContainer
      center={[26.1445, 91.7362]}
      zoom={13}
      scrollWheelZoom
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
      zoomControl={false}
    >
      {/* Dark OSM tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="dark-tiles"
      />

      <Clicker pickup={pickup} setPickup={setPickup} setDrop={setDrop} />
      <PanToPins pickup={pickup} drop={drop} />

      {pickup && (
        <Marker position={pickup} icon={pickupIcon}>
          <Popup className="dark-popup">
            <div style={{color:"#818cf8",fontWeight:700,fontSize:"13px"}}>📍 Pickup Location</div>
            <div style={{color:"#94a3b8",fontSize:"11px",marginTop:4}}>
              {pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)}
            </div>
            <button
              onClick={() => setPickup(null)}
              style={{marginTop:8,color:"#f87171",fontSize:"11px",cursor:"pointer",background:"none",border:"none",padding:0}}
            >Remove</button>
          </Popup>
        </Marker>
      )}

      {drop && (
        <Marker position={drop} icon={dropIcon}>
          <Popup>
            <div style={{color:"#a78bfa",fontWeight:700,fontSize:"13px"}}>🏁 Drop Location</div>
            <div style={{color:"#94a3b8",fontSize:"11px",marginTop:4}}>
              {drop.lat.toFixed(4)}, {drop.lng.toFixed(4)}
            </div>
            <button
              onClick={() => setDrop(null)}
              style={{marginTop:8,color:"#f87171",fontSize:"11px",cursor:"pointer",background:"none",border:"none",padding:0}}
            >Remove</button>
          </Popup>
        </Marker>
      )}

      {/* Route line between pins */}
      {pickup && drop && (
        <Polyline
          positions={[pickup, drop]}
          pathOptions={{
            color: "#818cf8",
            weight: 3,
            opacity: 0.8,
            dashArray: "8 6",
          }}
        />
      )}
    </MapContainer>
  );
}
