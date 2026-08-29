"use client";

import React, { useEffect, useRef, useState } from "react";
import { EmailAnalysis } from "@/types/analysis";
import { RelayHop } from "@/types/threat";
import {
  Globe,
  MapPin,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  Crosshair,
  ShieldAlert,
  Server,
  Radio,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Info
} from "lucide-react";
import { maskIp } from "@/lib/utils";
import { useSecurity } from "@/context/SecurityContext";
import { toast } from "sonner";

const CARTO_API_KEY = process.env.NEXT_PUBLIC_CARTO_API_KEY || "cb1_2jbr_1_671c43011522dcf553e27213";

// Free tile layers configuration
const TILE_LAYERS = {
  dark: {
    name: "Cyber Dark (CARTO)",
    url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  },
  osm: {
    name: "Standard Street (OSM)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abc",
    maxZoom: 19,
  },
  voyager: {
    name: "Clean Light (Voyager)",
    url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  },
  satellite: {
    name: "Satellite (ESRI)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    subdomains: "abc",
    maxZoom: 18,
  },
};

type TileKey = keyof typeof TILE_LAYERS;

interface RealLeafletMapProps {
  email: EmailAnalysis;
}

interface CustomPin {
  ip: string;
  query: string;
  city: string;
  country: string;
  isp: string;
  asn: string;
  lat: number;
  lng: number;
}

export default function RealLeafletMap({ email }: RealLeafletMapProps) {
  const { maskIps } = useSecurity();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const customPinRef = useRef<any>(null);

  const [activeTile, setActiveTile] = useState<TileKey>("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchedPin, setSearchedPin] = useState<CustomPin | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const origin = email.origin;
  const displayOriginIp = maskIps ? maskIp(origin.ip) : origin.ip;

  const validHops = email.relayPath.filter(
    (h) => typeof h.latitude === "number" && typeof h.longitude === "number" && (h.latitude !== 0 || h.longitude !== 0)
  );

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      // Dynamically import Leaflet on client side
      const L = (await import("leaflet")).default;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current && isMounted) {
        // Initial center
        const startLat = origin.latitude || (validHops[0]?.latitude ?? 20);
        const startLng = origin.longitude || (validHops[0]?.longitude ?? 0);

        const map = L.map(mapContainerRef.current, {
          center: [startLat, startLng],
          zoom: 4,
          zoomControl: false,
          attributionControl: true,
        });

        // Add custom zoom control top-right
        L.control.zoom({ position: "topright" }).addTo(map);

        // Add Base Tile Layer
        const tileConfig = TILE_LAYERS[activeTile];
        const tileLayer = L.tileLayer(tileConfig.url, {
          attribution: tileConfig.attribution,
          subdomains: tileConfig.subdomains,
          maxZoom: tileConfig.maxZoom,
        }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        tileLayerRef.current = tileLayer;
        markersGroupRef.current = markersGroup;
      }

      renderMapElements(L);
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update tile layer when activeTile changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    import("leaflet").then(({ default: L }) => {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const tileConfig = TILE_LAYERS[activeTile];
      const newLayer = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        subdomains: tileConfig.subdomains,
        maxZoom: tileConfig.maxZoom,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    });
  }, [activeTile]);

  // Re-render markers and lines when email data or mask changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then(({ default: L }) => {
      renderMapElements(L);
    });
  }, [email, maskIps, searchedPin]);

  const renderMapElements = (L: any) => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    const latLngPoints: [number, number][] = [];

    // 1. Plot Origin Node Marker
    if (typeof origin.latitude === "number" && typeof origin.longitude === "number" && (origin.latitude !== 0 || origin.longitude !== 0)) {
      const originLatLng: [number, number] = [origin.latitude, origin.longitude];
      latLngPoints.push(originLatLng);

      const originIconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <div class="absolute w-10 h-10 rounded-full bg-rose-500/30 animate-ping"></div>
          <div class="absolute w-6 h-6 rounded-full bg-rose-500/50"></div>
          <div class="relative w-7 h-7 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-mono text-[10px] font-bold">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="absolute -top-7 whitespace-nowrap bg-rose-950/90 text-rose-200 border border-rose-500/50 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-md">
            ORIGIN: ${origin.city || "Source"}
          </div>
        </div>
      `;

      const originIcon = L.divIcon({
        html: originIconHtml,
        className: "custom-origin-pin",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -18],
      });

      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px; line-height: 1.4; color: #1a2A2f; padding: 2px; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-weight: bold; color: #e11d48; text-transform: uppercase; font-size: 10px;">[Originating Server]</span>
            ${origin.proxyOrVpn ? '<span style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; font-size: 9px; padding: 1px 4px; border-radius: 4px; font-weight: bold;">VPN / PROXY</span>' : ''}
          </div>
          <div style="margin-bottom: 3px;"><strong>IP:</strong> <code style="background: #f1f5f9; padding: 1px 4px; border-radius: 3px; color: #0f172a;">${displayOriginIp}</code></div>
          <div style="margin-bottom: 3px;"><strong>Location:</strong> ${origin.city}, ${origin.region ? origin.region + ', ' : ''}${origin.country}</div>
          <div style="margin-bottom: 3px;"><strong>Coordinates:</strong> ${origin.latitude.toFixed(4)}°, ${origin.longitude.toFixed(4)}°</div>
          <div style="margin-bottom: 3px;"><strong>ISP:</strong> ${origin.isp}</div>
          <div style="margin-bottom: 3px;"><strong>ASN:</strong> ${origin.asn}</div>
          <div style="margin-top: 4px; font-size: 10px; color: #64748b;">Confidence: <strong>${origin.confidence}</strong></div>
        </div>
      `;

      const originMarker = L.marker(originLatLng, { icon: originIcon }).addTo(markersGroup);
      originMarker.bindPopup(popupHtml);
    }

    // 2. Plot Relay Hops
    email.relayPath.forEach((hop) => {
      if (typeof hop.latitude !== "number" || typeof hop.longitude !== "number" || (hop.latitude === 0 && hop.longitude === 0)) {
        return;
      }

      // If it's the exact same coordinate as origin and is origin hop, skip duplicate marker
      if (hop.isOrigin && origin.latitude === hop.latitude && origin.longitude === hop.longitude) {
        return;
      }

      const hopLatLng: [number, number] = [hop.latitude, hop.longitude];
      latLngPoints.push(hopLatLng);

      const isDest = hop.isDestination;
      const isAnomaly = hop.anomaly;
      const displayHopIp = maskIps ? maskIp(hop.ip) : hop.ip;

      const bgColor = isAnomaly ? "bg-amber-600" : isDest ? "bg-emerald-600" : "bg-[#1a2A2f]";
      const borderColor = isAnomaly ? "border-amber-300" : isDest ? "border-emerald-300" : "border-[#88BDF2]";

      const hopIconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div class="w-6 h-6 rounded-full ${bgColor} border-2 ${borderColor} shadow-md flex items-center justify-center text-white font-mono text-[9px] font-bold">
            ${hop.hopNumber}
          </div>
          <div class="absolute -top-6 whitespace-nowrap bg-slate-900/90 text-slate-200 border border-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono">
            Hop #${hop.hopNumber} (${hop.city || "Gateway"})
          </div>
        </div>
      `;

      const hopIcon = L.divIcon({
        html: hopIconHtml,
        className: "custom-hop-pin",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14],
      });

      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px; line-height: 1.4; color: #1a2A2f; padding: 2px; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
            <span style="font-weight: bold; color: ${isAnomaly ? '#d97706' : isDest ? '#059669' : '#0284c7'}; text-transform: uppercase; font-size: 10px;">
              ${isDest ? '[Recipient MX Gateway]' : `[Relay Node Hop #${hop.hopNumber}]`}
            </span>
          </div>
          <div style="margin-bottom: 3px;"><strong>IP:</strong> <code style="background: #f1f5f9; padding: 1px 4px; border-radius: 3px; color: #0f172a;">${displayHopIp}</code></div>
          <div style="margin-bottom: 3px;"><strong>Server:</strong> ${hop.fromHost || hop.ip}</div>
          <div style="margin-bottom: 3px;"><strong>Location:</strong> ${hop.city}, ${hop.country}</div>
          <div style="margin-bottom: 3px;"><strong>Coordinates:</strong> ${hop.latitude.toFixed(4)}°, ${hop.longitude.toFixed(4)}°</div>
          <div style="margin-bottom: 3px;"><strong>ISP / ASN:</strong> ${hop.isp} (${hop.asn || "N/A"})</div>
          <div style="margin-bottom: 3px;"><strong>Protocol / TLS:</strong> ${hop.protocol} (${hop.tlsVersion})</div>
          ${hop.anomalyReason ? `<div style="margin-top: 4px; padding: 3px 5px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; border-radius: 4px; font-size: 10px;">⚠️ ${hop.anomalyReason}</div>` : ''}
        </div>
      `;

      const marker = L.marker(hopLatLng, { icon: hopIcon }).addTo(markersGroup);
      marker.bindPopup(popupHtml);
    });

    // 3. Plot Live Searched Custom Pin (if any)
    if (searchedPin) {
      const searchLatLng: [number, number] = [searchedPin.lat, searchedPin.lng];
      latLngPoints.push(searchLatLng);

      const searchIconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-400/40 animate-ping"></div>
          <div class="w-7 h-7 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-bold">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <div class="absolute -top-7 whitespace-nowrap bg-cyan-950/90 text-cyan-200 border border-cyan-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-md">
            PINNED: ${searchedPin.city || searchedPin.query}
          </div>
        </div>
      `;

      const searchIcon = L.divIcon({
        html: searchIconHtml,
        className: "custom-search-pin",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -18],
      });

      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px; line-height: 1.4; color: #1a2A2f; padding: 2px; min-width: 210px;">
          <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px; font-weight: bold; color: #0891b2; text-transform: uppercase; font-size: 10px;">
            [Custom Queried Node]
          </div>
          <div style="margin-bottom: 3px;"><strong>Query:</strong> ${searchedPin.query}</div>
          <div style="margin-bottom: 3px;"><strong>IP:</strong> <code style="background: #f1f5f9; padding: 1px 4px; border-radius: 3px;">${searchedPin.ip}</code></div>
          <div style="margin-bottom: 3px;"><strong>Location:</strong> ${searchedPin.city}, ${searchedPin.country}</div>
          <div style="margin-bottom: 3px;"><strong>Coordinates:</strong> ${searchedPin.lat.toFixed(4)}°, ${searchedPin.lng.toFixed(4)}°</div>
          <div style="margin-bottom: 3px;"><strong>ISP:</strong> ${searchedPin.isp}</div>
          <div style="margin-bottom: 3px;"><strong>ASN:</strong> ${searchedPin.asn}</div>
        </div>
      `;

      const searchMarker = L.marker(searchLatLng, { icon: searchIcon }).addTo(markersGroup);
      searchMarker.bindPopup(popupHtml).openPopup();
      customPinRef.current = searchMarker;
    }

    // 4. Draw Connecting Polyline / Transmission Route
    if (latLngPoints.length > 1) {
      const polyline = L.polyline(latLngPoints, {
        color: "#88BDF2",
        weight: 3,
        opacity: 0.85,
        dashArray: "8, 6",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      polylineRef.current = polyline;
    }
  };

  // Center on Origin
  const handleCenterOrigin = () => {
    if (!mapInstanceRef.current) return;
    if (origin.latitude && origin.longitude) {
      mapInstanceRef.current.flyTo([origin.latitude, origin.longitude], 7, {
        duration: 1.2,
      });
      toast.info(`Focused on Origin: ${origin.city}, ${origin.country}`);
    }
  };

  // Fit all points in view
  const handleFitBounds = () => {
    if (!mapInstanceRef.current) return;
    import("leaflet").then(({ default: L }) => {
      const points: [number, number][] = [];
      if (origin.latitude && origin.longitude) points.push([origin.latitude, origin.longitude]);
      validHops.forEach((h) => points.push([h.latitude, h.longitude]));
      if (searchedPin) points.push([searchedPin.lat, searchedPin.lng]);

      if (points.length > 0) {
        const bounds = L.latLngBounds(points);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    });
  };

  // Live GeoIP Search Handler
  const handleSearchIp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/geoip?ip=${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const d = result.data;
          if (d.latitude && d.longitude && (d.latitude !== 0 || d.longitude !== 0)) {
            const newPin: CustomPin = {
              ip: d.ip,
              query: searchQuery.trim(),
              city: d.city,
              country: d.country,
              isp: d.isp,
              asn: d.asn,
              lat: d.latitude,
              lng: d.longitude,
            };
            setSearchedPin(newPin);

            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([d.latitude, d.longitude], 8, { duration: 1.2 });
            }
            toast.success(`Resolved ${searchQuery.trim()} → ${d.city}, ${d.country} (${d.latitude.toFixed(2)}°, ${d.longitude.toFixed(2)}°)`);
          } else {
            toast.warning(`Resolved ${searchQuery.trim()} but exact GPS coordinates were not found.`);
          }
        }
      } else {
        toast.error("Could not resolve geolocation for specified IP / domain.");
      }
    } catch (err) {
      console.error("Search IP error:", err);
      toast.error("Failed to query GeoIP service.");
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    toast.success(`Copied ${label}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 bg-[#1a2A2f] p-4 sm:p-6 overflow-y-auto" : ""}`}>
      {/* Forensic Intelligence Header Banner */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#1a2A2f] flex items-center gap-2">
              <span>Real-World Geospatial Origin & Relay Map</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                100% Free OpenStreetMap &amp; CARTO Tiles
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Strictly plots the genuine originating physical source IP and sequential RFC-822 relay hops onto interactive satellite and street maps.
            </p>
          </div>
        </div>

        {/* Live GeoIP Search Bar */}
        <form onSubmit={handleSearchIp} className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Inspect any IP / Domain (e.g. 8.8.8.8)..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-[#1a2A2f] placeholder-slate-400 focus:outline-none focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 rounded-lg bg-[#1a2A2f] hover:bg-[#1a2A2f]/90 text-white font-bold text-xs font-mono shrink-0 transition-all flex items-center gap-1.5 shadow-sm"
          >
            {isSearching ? <Zap className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5 text-[#88BDF2]" />}
            <span>Pin IP</span>
          </button>
        </form>
      </div>

      {/* Main Interactive Map Card */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-md relative">
        {/* Map Top Bar Controls */}
        <div className="p-3 bg-slate-50/95 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-10 relative">
          {/* Origin Quick Stats */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-rose-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse glow-dot-red" />
              Origin: {origin.city}, {origin.country}
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-600">
              Coordinates: <strong className="text-[#1a2A2f]">{origin.latitude.toFixed(4)}°, {origin.longitude.toFixed(4)}°</strong>
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-600 hidden md:inline">
              Hops Plotted: <strong className="text-[#1a2A2f]">{validHops.length} Nodes</strong>
            </span>
          </div>

          {/* Map Layer Switcher & Camera Tools */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Tile Layer Selector */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[10px] font-mono shadow-sm">
              {(Object.keys(TILE_LAYERS) as TileKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTile(key)}
                  className={`px-2 py-1 rounded transition-all font-semibold ${
                    activeTile === key
                      ? "bg-[#1a2A2f] text-white shadow-sm"
                      : "text-slate-600 hover:text-[#1a2A2f]"
                  }`}
                  title={TILE_LAYERS[key].name}
                >
                  {key === "dark" ? "Dark Cyber" : key === "osm" ? "Street OSM" : key === "voyager" ? "Voyager" : "Satellite"}
                </button>
              ))}
            </div>

            {/* Center Origin Button */}
            <button
              type="button"
              onClick={handleCenterOrigin}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#1a2A2f] text-xs font-mono shadow-sm transition-all flex items-center gap-1"
              title="Center on Origin Location"
            >
              <Crosshair className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline text-[11px]">Origin</span>
            </button>

            {/* Fit All Hops */}
            <button
              type="button"
              onClick={handleFitBounds}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#1a2A2f] text-xs font-mono shadow-sm transition-all flex items-center gap-1"
              title="Fit all relay hops into view"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#1a2A2f]" />
              <span className="hidden sm:inline text-[11px]">Fit View</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#1a2A2f] text-xs font-mono shadow-sm transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Leaflet Map Canvas */}
        <div
          ref={mapContainerRef}
          className={`w-full bg-[#1a2A2f] relative z-0 ${isFullscreen ? "h-[calc(100vh-220px)]" : "h-[450px]"}`}
          style={{ minHeight: "400px" }}
        />

        {/* Floating Origin Node Card Overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl text-xs font-mono max-w-full sm:max-w-md z-10">
          <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-slate-200">
            <span className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Originating IP: {displayOriginIp}
            </span>
            <div className="flex items-center gap-1">
              {origin.proxyOrVpn && (
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold border border-amber-300">
                  VPN / PROXY DETECTED
                </span>
              )}
              <button
                type="button"
                onClick={() => copyToClipboard(origin.ip, "Origin IP")}
                className="p-1 text-slate-400 hover:text-[#1a2A2f]"
                title="Copy Origin IP"
              >
                {copiedText === "Origin IP" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-2.5 text-[11px]">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Country / City:</span>
              <div className="text-[#1a2A2f] font-bold truncate">{origin.city}, {origin.country}</div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-semibold">Autonomous System:</span>
              <div className="text-[#1a2A2f] font-bold truncate">{origin.asn}</div>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 text-[10px] uppercase font-semibold">ISP Infrastructure:</span>
              <div className="text-slate-700 font-medium truncate">{origin.isp}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Relay Path Hops Telemetry Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hop Breakdown */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 font-mono text-xs">
          <div className="font-bold text-[#1a2A2f] flex items-center gap-2 pb-2 border-b border-slate-200">
            <Server className="w-4 h-4 text-[#88BDF2]" />
            <span>Multi-Hop Relay Chain ({email.relayPath.length} Total)</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {email.relayPath.map((hop) => (
              <div
                key={hop.id}
                className={`p-2 rounded-lg border flex items-center justify-between text-[11px] ${
                  hop.isOrigin
                    ? "bg-rose-50 border-rose-200 text-rose-900 font-semibold"
                    : hop.isDestination
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <div className="truncate">
                  <span className="font-bold mr-1.5">Hop #{hop.hopNumber}:</span>
                  <span>{hop.city || "Unknown"}, {hop.country}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                  {maskIps ? maskIp(hop.ip) : hop.ip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Physical Geolocation Details */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 font-mono text-xs">
          <div className="font-bold text-[#1a2A2f] flex items-center gap-2 pb-2 border-b border-slate-200">
            <Radio className="w-4 h-4 text-rose-500" />
            <span>Physical Coordinate Precision</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Latitude:</span>
              <span className="font-bold text-[#1a2A2f]">{origin.latitude.toFixed(6)}° N</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Longitude:</span>
              <span className="font-bold text-[#1a2A2f]">{origin.longitude.toFixed(6)}° E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Attribution Method:</span>
              <span className="font-semibold text-emerald-700">Real-Time IP Geolocation</span>
            </div>
          </div>
        </div>

        {/* Forensic Intelligence Disclaimer */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="font-bold text-[#1a2A2f] flex items-center gap-2 pb-2 border-b border-slate-200">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Attribution Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
              IP Geolocation estimates the geographic location of ISP and hosting infrastructure routers, and is not a conclusive proof of human physical presence or identity.
            </p>
          </div>
          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100">
            OpenStreetMap &amp; CARTO Map Tiles &bull; Free Open Infrastructure
          </div>
        </div>
      </div>
    </div>
  );
}
