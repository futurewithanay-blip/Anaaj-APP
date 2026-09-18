/**
 * MandiMap.jsx — Smart Mandi & Warehouse Map
 * Tiles:   OpenStreetMap standard (free, no API key)
 * Overlay: India states GeoJSON political map (colored states + boundaries)
 * Plugins: leaflet.markercluster, leaflet-routing-machine
 * Geocoding: Nominatim (free, no API key) — swappable to Google Places
 * Data: GEO_MANDIS / GEO_WAREHOUSES from mandiData.js (mirrors /api/mandis shape)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-routing-machine';
import {
  MapPin, Navigation, Warehouse, Search, Phone, Compass,
  X, Star, Shield, Zap, Filter, LocateFixed, Route,
  ChevronDown, AlertTriangle, Clock, Truck, TrendingUp,
} from 'lucide-react';
import { GEO_MANDIS, GEO_WAREHOUSES } from '../../data/mandiData';

// ─── Haversine Distance ──────────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Custom SVG Marker Icons ──────────────────────────────────────────────────
function makeSvgIcon(color, emoji, size = 36) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 8}" viewBox="0 0 ${size} ${size + 8}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1}" fill="${color}" stroke="white" stroke-width="2.5"/>
      <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" font-size="${size * 0.44}">${emoji}</text>
      <polygon points="${size / 2 - 5},${size - 1} ${size / 2 + 5},${size - 1} ${size / 2},${size + 8}" fill="${color}"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

const MANDI_ICON     = () => makeSvgIcon('#16a34a', '🏛', 38);
const WAREHOUSE_ICON = () => makeSvgIcon('#0284c7', '🏭', 38);
const COLD_ICON      = () => makeSvgIcon('#7c3aed', '❄', 38);
const USER_ICON      = () => makeSvgIcon('#f59e0b', '📍', 32);

// ─── Nominatim Geocoding ──────────────────────────────────────────────────────
async function nominatimSearch(query) {
  if (!query || query.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},India&format=json&limit=5&countrycodes=in&addressdetails=1`;
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    return data.map(d => ({
      label: d.display_name.split(',').slice(0, 3).join(', '),
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
    }));
  } catch {
    return [];
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MandiMap({ t }) {
  const mapContainerRef  = useRef(null);
  const mapRef           = useRef(null);
  const mandiLayerRef    = useRef(null);
  const whLayerRef       = useRef(null);
  const circleRef        = useRef(null);
  const userMarkerRef    = useRef(null);
  const routeRef         = useRef(null);
  const geoJsonLayerRef  = useRef(null);  // India states political map layer

  // ── State ────────────────────────────────────────────────────────────────
  const [radiusKm,       setRadiusKm]       = useState(100);
  const [showMandis,     setShowMandis]     = useState(true);
  const [showWarehouses, setShowWarehouses] = useState(true);
  const [userPos,        setUserPos]        = useState(null);   // { lat, lng, label }
  const [selectedItem,   setSelectedItem]   = useState(null);  // clicked marker data
  const [routeInfo,      setRouteInfo]      = useState(null);  // { distance, time }
  const [geoError,       setGeoError]       = useState('');
  const [geoLoading,     setGeoLoading]     = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [suggestions,    setSuggestions]    = useState([]);
  const [searchLoading,  setSearchLoading]  = useState(false);
  const [ratePerKm,      setRatePerKm]      = useState(18);
  const [visibleMandis,  setVisibleMandis]  = useState([]);
  const [visibleWH,      setVisibleWH]      = useState([]);
  const debounceRef = useRef(null);

  // ── Init Leaflet Map ─────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Fix default marker icon paths broken by Vite bundling
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    // ── Base tiles: OpenStreetMap (free, no API key, India political labels) ──
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    // ── India States Political Map — GeoJSON overlay ──────────────────────────
    // 28 distinct political-map colors (warm palette — readable on OSM tiles)
    const STATE_COLORS = [
      '#e8c77a','#a8d8a8','#f4a97a','#97c1e0','#d4a8d8',
      '#89d4c4','#f4c880','#b5d98a','#e0a8b0','#a0c8e8',
      '#c8e0a0','#f0b880','#b0a8d8','#80c8c0','#e8b4a0',
      '#a8d0a8','#c0b8e0','#d8c0a0','#a0d0d8','#e0c0b0',
      '#b8d0c0','#d0a8c0','#c8d080','#a8b8d8','#e8d0a0',
      '#b0d8b0','#d8b0a8','#c4e0d0',
    ];

    fetch(
      'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson'
    )
      .then(r => r.json())
      .then(data => {
        let ci = 0;
        const geoLayer = L.geoJSON(data, {
          style: () => ({
            fillColor:   STATE_COLORS[ci++ % STATE_COLORS.length],
            fillOpacity: 0.38,
            color:       '#444',
            weight:      1.8,
            opacity:     0.9,
          }),
          onEachFeature: (feature, layer) => {
            const name = feature.properties?.ST_NM || feature.properties?.NAME_1 || '';
            if (name) {
              layer.bindTooltip(name, {
                permanent: false,
                direction: 'center',
                className: 'leaflet-tooltip-state',
              });
              layer.on('mouseover', function () { this.setStyle({ fillOpacity: 0.6, weight: 2.5 }); });
              layer.on('mouseout',  function () { geoLayer.resetStyle(this); });
            }
          },
        });
        geoLayer.addTo(map);
        geoLayer.bringToBack();   // keep below mandi/warehouse markers
        geoJsonLayerRef.current = geoLayer;
      })
      .catch(() => console.warn('India GeoJSON unavailable — map still works without state overlay'));

    // Click-to-place user pin
    map.on('click', (e) => {
      placeUserMarker(map, e.latlng.lat, e.latlng.lng, 'Selected Location');
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Place User Marker ────────────────────────────────────────────────────
  const placeUserMarker = useCallback((map, lat, lng, label) => {
    if (userMarkerRef.current) userMarkerRef.current.remove();
    const marker = L.marker([lat, lng], { icon: USER_ICON(), zIndexOffset: 1000 })
      .addTo(map)
      .bindTooltip(`📍 ${label}`, { permanent: false, direction: 'top' });
    userMarkerRef.current = marker;
    setUserPos({ lat, lng, label });
    setSelectedItem(null);
    setRouteInfo(null);
    if (routeRef.current) { routeRef.current.remove(); routeRef.current = null; }
  }, []);

  // ── Render Markers + Radius when userPos / radius / toggles change ────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old layers
    if (mandiLayerRef.current) { map.removeLayer(mandiLayerRef.current); mandiLayerRef.current = null; }
    if (whLayerRef.current)    { map.removeLayer(whLayerRef.current);    whLayerRef.current = null; }
    if (circleRef.current)     { map.removeLayer(circleRef.current);     circleRef.current = null; }

    const center = userPos || { lat: 20.5937, lng: 78.9629 };

    // Filter by radius
    const inRadiusMandis = GEO_MANDIS.filter(m =>
      haversine(center.lat, center.lng, m.lat, m.lng) <= radiusKm
    );
    const inRadiusWH = GEO_WAREHOUSES.filter(w =>
      haversine(center.lat, center.lng, w.lat, w.lng) <= radiusKm
    );
    setVisibleMandis(inRadiusMandis);
    setVisibleWH(inRadiusWH);

    // Draw radius circle
    const circle = L.circle([center.lat, center.lng], {
      radius: radiusKm * 1000,
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.04,
      weight: 1.5,
      dashArray: '6 4',
    }).addTo(map);
    circleRef.current = circle;

    // Fit map to circle
    if (userPos) {
      map.fitBounds(circle.getBounds(), { padding: [30, 30], maxZoom: 10 });
    }

    // ── Mandi cluster layer ──
    if (showMandis) {
      const cluster = L.markerClusterGroup({
        maxClusterRadius: 50,
        iconCreateFunction: (c) => {
          return L.divIcon({
            html: `<div class="leaflet-cluster-mandi">${c.getChildCount()}</div>`,
            className: '',
            iconSize: [40, 40],
          });
        },
      });
      inRadiusMandis.forEach(m => {
        const dist = Math.round(haversine(center.lat, center.lng, m.lat, m.lng));
        const marker = L.marker([m.lat, m.lng], { icon: MANDI_ICON() })
          .bindTooltip(
            `<b>${m.shortName}</b><br>${dist} km away`,
            { direction: 'top', className: 'leaflet-tooltip-dark' }
          );
        marker.on('click', () => setSelectedItem({ ...m, kind: 'mandi', distKm: dist }));
        cluster.addLayer(marker);
      });
      cluster.addTo(map);
      mandiLayerRef.current = cluster;
    }

    // ── Warehouse cluster layer ──
    if (showWarehouses) {
      const cluster = L.markerClusterGroup({
        maxClusterRadius: 50,
        iconCreateFunction: (c) => {
          return L.divIcon({
            html: `<div class="leaflet-cluster-wh">${c.getChildCount()}</div>`,
            className: '',
            iconSize: [40, 40],
          });
        },
      });
      inRadiusWH.forEach(w => {
        const dist  = Math.round(haversine(center.lat, center.lng, w.lat, w.lng));
        const icon  = w.type === 'cold' ? COLD_ICON() : WAREHOUSE_ICON();
        const marker = L.marker([w.lat, w.lng], { icon })
          .bindTooltip(
            `<b>${w.shortName}</b><br>${w.availablePercent}% available — ${dist} km`,
            { direction: 'top', className: 'leaflet-tooltip-dark' }
          );
        marker.on('click', () => setSelectedItem({ ...w, kind: 'warehouse', distKm: dist }));
        cluster.addLayer(marker);
      });
      cluster.addTo(map);
      whLayerRef.current = cluster;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPos, radiusKm, showMandis, showWarehouses]);

  // ── GPS Geolocation ───────────────────────────────────────────────────────
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        placeUserMarker(mapRef.current, lat, lng, 'Your Current Location');
        mapRef.current?.setView([lat, lng], 9, { animate: true });
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === 1) setGeoError('Location access denied — search manually or tap the map instead.');
        else setGeoError('Could not get location. Please search or tap on the map.');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // ── Nominatim Autocomplete (300ms debounce) ───────────────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSuggestions([]);
    clearTimeout(debounceRef.current);
    if (val.length < 3) return;
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      const results = await nominatimSearch(val);
      setSuggestions(results);
      setSearchLoading(false);
    }, 300);
  };

  const handleSuggestionClick = (s) => {
    setSuggestions([]);
    setSearchQuery(s.label);
    placeUserMarker(mapRef.current, s.lat, s.lng, s.label);
    mapRef.current?.setView([s.lat, s.lng], 9, { animate: true });
  };

  // ── Get Directions (Leaflet Routing Machine → OSRM) ───────────────────────
  const handleGetDirections = () => {
    const map = mapRef.current;
    if (!map || !selectedItem || !userPos) return;
    if (routeRef.current) { routeRef.current.remove(); routeRef.current = null; }
    setRouteInfo(null);

    const control = L.Routing.control({
      waypoints: [
        L.latLng(userPos.lat, userPos.lng),
        L.latLng(selectedItem.lat, selectedItem.lng),
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#f59e0b', weight: 4, opacity: 0.85 }],
        addWaypoints: false,
      },
      createMarker: () => null, // hide default routing markers
      collapsible: true,
      show: false, // hide turn-by-turn panel
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving',
      }),
    }).addTo(map);

    control.on('routesfound', (e) => {
      const route = e.routes[0];
      const distKm = (route.summary.totalDistance / 1000).toFixed(1);
      const mins   = Math.round(route.summary.totalTime / 60);
      const hrs    = Math.floor(mins / 60);
      const rem    = mins % 60;
      const timeStr = hrs > 0 ? `${hrs}h ${rem}m` : `${mins}m`;
      setRouteInfo({ distKm, timeStr, cost: Math.round(distKm * ratePerKm) });
    });

    control.on('routingerror', () => {
      setRouteInfo({ error: true });
    });

    routeRef.current = control;
  };

  // ── Clear route ───────────────────────────────────────────────────────────
  const clearRoute = () => {
    if (routeRef.current) { routeRef.current.remove(); routeRef.current = null; }
    setRouteInfo(null);
  };

  // ── Radius change ─────────────────────────────────────────────────────────
  const handleRadiusChange = (r) => {
    setRadiusKm(r);
    setSelectedItem(null);
    clearRoute();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">

      {/* ── Header ── */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Interactive GIS Market Map
            </span>
            <h3 className="text-xl font-bold mt-1 flex items-center gap-2">
              🗺️ Smart Mandi & Warehouse Map
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time geospatial discovery of APMC markets, cold storages & transport routes
            </p>
          </div>

          {/* Radius Filter */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/10 flex-wrap">
            <span className="text-xs font-semibold text-slate-300">Search Radius:</span>
            {[25, 50, 100, 200].map(r => (
              <button key={r} onClick={() => handleRadiusChange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  radiusKm === r ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-slate-300 hover:bg-white/15'
                }`}>
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row" style={{ minHeight: '520px' }}>

        {/* ── Map Area (left 2/3) ── */}
        <div className="lg:flex-1 flex flex-col bg-slate-50 relative">

          {/* Map controls toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white/95 border-b border-slate-200 z-10">
            {/* Search */}
            <div className="flex-1 relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search village / district / taluka..."
                className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 text-slate-800 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 shadow-sm"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              )}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(s)}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Button */}
            <button onClick={handleGeolocate} disabled={geoLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition whitespace-nowrap">
              {geoLoading
                ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <LocateFixed className="w-3.5 h-3.5" />}
              <span>{geoLoading ? 'Getting GPS...' : 'My Location'}</span>
            </button>

            {/* Layer Toggles */}
            <label className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition ${showMandis ? 'bg-emerald-700/40 border-emerald-500 text-emerald-300' : 'border-slate-700 text-slate-400 bg-slate-800'}`}>
              <input type="checkbox" checked={showMandis} onChange={e => setShowMandis(e.target.checked)} className="w-3 h-3 accent-emerald-500" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              APMC Mandis ({visibleMandis.length})
            </label>

            <label className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition ${showWarehouses ? 'bg-sky-700/40 border-sky-500 text-sky-300' : 'border-slate-700 text-slate-400 bg-slate-800'}`}>
              <input type="checkbox" checked={showWarehouses} onChange={e => setShowWarehouses(e.target.checked)} className="w-3 h-3 accent-sky-500" />
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
              Warehouses ({visibleWH.length})
            </label>
          </div>

          {/* Geolocation Error Banner */}
          {geoError && (
            <div className="flex items-start gap-2 p-3 bg-red-900/60 border-b border-red-800 text-red-200 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{geoError}</span>
              <button onClick={() => setGeoError('')} className="ml-auto text-red-400 hover:text-red-200"><X className="w-4 h-4" /></button>
            </div>
          )}

          {/* Hint when no user location yet */}
          {!userPos && !geoError && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100 text-amber-700 text-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Tap "My Location", search a place, or <strong>click anywhere on the map</strong> to set your location and discover nearby mandis.</span>
            </div>
          )}

          {/* Leaflet Map Container */}
          <div
            ref={mapContainerRef}
            className="flex-1"
            style={{ minHeight: '400px', background: '#f8fafc' }}
          />

          {/* Rate per km editor */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white border-t border-slate-200 text-xs text-slate-500">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Transport rate:</span>
            <span className="font-bold text-slate-600">₹</span>
            <input
              type="number" min={5} max={50} step={1} value={ratePerKm}
              onChange={e => setRatePerKm(+e.target.value)}
              className="w-16 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 text-center"
            />
            <span>/km (edit to match your vehicle)</span>
          </div>
        </div>

        {/* ── Detail Side Panel (right 1/3) ── */}
        <div className="lg:w-80 xl:w-96 bg-white border-l border-slate-200 flex flex-col overflow-hidden">

          {selectedItem ? (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Panel header */}
              <div className={`p-4 flex items-start justify-between gap-2 ${
                selectedItem.kind === 'mandi' ? 'bg-emerald-50 border-b border-emerald-100' : 'bg-sky-50 border-b border-sky-100'
              }`}>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      selectedItem.kind === 'mandi' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {selectedItem.kind === 'mandi' ? '🏛 APMC Mandi' : selectedItem.type === 'cold' ? '❄ Cold Storage' : '🏭 Dry Warehouse'}
                    </span>
                    {selectedItem.eNAM && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">e-NAM</span>
                    )}
                  </div>
                  <h4 className="font-black text-slate-900 text-sm leading-tight">{selectedItem.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedItem.district}</p>
                </div>
                <button onClick={() => { setSelectedItem(null); clearRoute(); }}
                  className="text-slate-400 hover:text-slate-600 flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>

              <div className="p-4 space-y-4 flex-1">
                {/* Distance & Estimated Transport */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-400 mb-0.5">Distance</p>
                    <p className="font-black text-slate-800 text-lg">{selectedItem.distKm} km</p>
                    <p className="text-[10px] text-slate-400">(haversine)</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                    <p className="text-[10px] text-amber-600 mb-0.5">Est. Transport</p>
                    <p className="font-black text-amber-800 text-lg">
                      ₹{(selectedItem.distKm * ratePerKm).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-amber-500">@₹{ratePerKm}/km</p>
                  </div>
                </div>

                {/* Route Info (shown after "Get Directions") */}
                {routeInfo && !routeInfo.error && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1.5">
                    <p className="text-xs font-black text-blue-800 flex items-center gap-1">
                      <Route className="w-3.5 h-3.5" /> Real Road Route (OSRM)
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center mt-1">
                      <div><p className="text-[10px] text-blue-500">Road Dist.</p><p className="font-black text-blue-800">{routeInfo.distKm} km</p></div>
                      <div><p className="text-[10px] text-blue-500">Drive Time</p><p className="font-black text-blue-800">{routeInfo.timeStr}</p></div>
                      <div><p className="text-[10px] text-blue-500">Freight Est.</p><p className="font-black text-blue-800">₹{routeInfo.cost.toLocaleString()}</p></div>
                    </div>
                    <button onClick={clearRoute} className="text-[10px] text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-1">
                      <X className="w-3 h-3" /> Clear route
                    </button>
                  </div>
                )}
                {routeInfo?.error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                    ⚠ Could not fetch road route. Showing haversine distance only.
                  </div>
                )}

                {/* MANDI-specific info */}
                {selectedItem.kind === 'mandi' && (
                  <>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Today's Arrivals:</span><strong className="text-slate-800">{selectedItem.arrivals}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Active Buyers:</span><strong className="text-blue-700">{selectedItem.activeBuyers}</strong></div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Farmer Rating:</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <strong>{selectedItem.rating}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Crop Prices */}
                    {selectedItem.prices && (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">Today's Crop Prices</p>
                        {Object.entries(selectedItem.prices).map(([crop, price]) => (
                          <div key={crop} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2">
                            <span className="text-xs text-slate-600">{crop}</span>
                            <span className="text-xs font-black text-emerald-700">₹{price.toLocaleString()}/Q</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Traded crops */}
                    <div>
                      <p className="text-[10px] text-slate-400 mb-1.5">Crops Traded Here</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedItem.crops?.map(c => (
                          <span key={c} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{c}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* WAREHOUSE-specific info */}
                {selectedItem.kind === 'warehouse' && (
                  <>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">Type:</span><strong className={selectedItem.type === 'cold' ? 'text-purple-700' : 'text-blue-700'}>{selectedItem.type === 'cold' ? '❄ Cold Storage' : '📦 Dry Warehouse'}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Total Capacity:</span><strong className="text-slate-800">{selectedItem.capacity.toLocaleString()} MT</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Storage Rate:</span><strong className="text-slate-800">₹{selectedItem.ratePerQtlPerDay}/Qtl/day</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Minimum Stay:</span><strong className="text-slate-800">{selectedItem.minDays} days</strong></div>
                    </div>

                    {/* Available capacity bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Available Space</span>
                        <span className={`font-black ${selectedItem.availablePercent > 50 ? 'text-emerald-700' : selectedItem.availablePercent > 25 ? 'text-amber-700' : 'text-red-600'}`}>
                          {selectedItem.availablePercent}% free
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${selectedItem.availablePercent > 50 ? 'bg-emerald-500' : selectedItem.availablePercent > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${selectedItem.availablePercent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {Math.round(selectedItem.capacity * selectedItem.availablePercent / 100).toLocaleString()} MT available now
                      </p>
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.certifications?.map(c => (
                        <span key={c} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" />{c}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="p-4 border-t border-slate-100 space-y-2">
                <button onClick={handleGetDirections}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition">
                  <Route className="w-3.5 h-3.5" />
                  {routeInfo ? 'Recalculate Route' : 'Get Road Directions'}
                </button>
                <a href={`tel:${selectedItem.phone}`}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Call: {selectedItem.phone}
                </a>
              </div>
            </div>

          ) : (
            /* Empty state */
            <div className="flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Select a Location on Map</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs">
                    Discover live buyer demand, warehouse space, crop prices & transport times for mandis in your region.
                  </p>
                </div>

                {/* How to use guide */}
                <div className="w-full text-left space-y-2 mt-2">
                  {[
                    { icon: <LocateFixed className="w-3.5 h-3.5 text-emerald-500" />, text: 'Click "My Location" for GPS auto-detect' },
                    { icon: <Search className="w-3.5 h-3.5 text-blue-500" />,       text: 'Search your village or district name' },
                    { icon: <MapPin className="w-3.5 h-3.5 text-amber-500" />,      text: 'Or tap anywhere on the map directly' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2">
                      {step.icon} {step.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats footer */}
              <div className="border-t border-slate-100 p-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="font-black text-slate-800 text-base">{GEO_MANDIS.length}</p>
                  <p className="text-slate-400">APMC Mandis</p>
                </div>
                <div>
                  <p className="font-black text-slate-800 text-base">{GEO_WAREHOUSES.length}</p>
                  <p className="text-slate-400">Warehouses</p>
                </div>
                <div>
                  <p className="font-black text-emerald-600 text-base">100%</p>
                  <p className="text-slate-400">e-NAM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Custom CSS injected into page for Leaflet overrides ── */}
      <style>{`
        /* Cluster bubble — Mandis */
        .leaflet-cluster-mandi {
          width: 38px; height: 38px; background: #16a34a; border: 3px solid #fff;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 900; font-size: 13px;
          box-shadow: 0 2px 8px rgba(22,163,74,0.5);
        }
        /* Cluster bubble — Warehouses */
        .leaflet-cluster-wh {
          width: 38px; height: 38px; background: #0284c7; border: 3px solid #fff;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 900; font-size: 13px;
          box-shadow: 0 2px 8px rgba(2,132,199,0.5);
        }
        /* Dark tooltip — mandi/warehouse markers */
        .leaflet-tooltip-dark {
          background: #1e293b !important; color: #f1f5f9 !important;
          border: 1px solid #334155 !important; border-radius: 8px !important;
          font-size: 11px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
        }
        .leaflet-tooltip-dark.leaflet-tooltip-top::before { border-top-color: #334155 !important; }
        /* State name tooltip — political map hover */
        .leaflet-tooltip-state {
          background: rgba(255,255,255,0.93) !important; color: #1e293b !important;
          border: 1px solid #cbd5e1 !important; border-radius: 6px !important;
          font-size: 11px !important; font-weight: 700 !important;
          padding: 3px 8px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
          white-space: nowrap !important; pointer-events: none !important;
        }
        .leaflet-tooltip-state::before { display: none !important; }
        /* Routing machine panel — hidden; route info shown in our side panel */
        .leaflet-routing-container { display: none !important; }
        /* Smooth cluster hover */
        .marker-cluster { transition: transform 0.2s; }
        .marker-cluster:hover { transform: scale(1.15); }
        /* Zoom control — clean white to match OSM light tiles */
        .leaflet-control-zoom a {
          background: #fff !important; color: #374151 !important;
          border-color: #d1d5db !important; font-weight: 700 !important;
        }
        .leaflet-control-zoom a:hover { background: #f3f4f6 !important; color: #111 !important; }
        /* Attribution */
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.85) !important; color: #6b7280 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #4b5563 !important; }
        /* No pointer on state polygons */
        .leaflet-interactive { cursor: default !important; }
      `}</style>
    </div>
  );
}
