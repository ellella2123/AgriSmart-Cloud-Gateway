import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { MapPin, Sparkles, Navigation, Loader2, Search } from "lucide-react";
import { fetchLiveWeather, reverseGeocodeCoords, geocodeAddress, LiveWeather } from "../utils/weather";
import { ErrorBoundary } from "./ErrorBoundary";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet icon issues in React
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom picker icon 🚜
const pickerIcon = L.divIcon({
  className: "custom-picker-icon",
  html: `
    <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-700 ring-4 ring-emerald-100 border-2 border-white shadow-lg text-white font-bold transition-transform duration-300 transform hover:scale-110">
      <span class="text-base" style="line-height: 1;">🚜</span>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Custom item marker icon 🌾 or 📜
const createItemIcon = (isGold: boolean) => L.divIcon({
  className: "custom-item-icon",
  html: `
    <div class="relative flex items-center justify-center w-9 h-9 rounded-full ${
      isGold ? "bg-amber-600 ring-4 ring-amber-100" : "bg-emerald-600 ring-4 ring-emerald-100"
    } border-2 border-white shadow-md text-white font-bold transition-transform duration-300 transform hover:scale-110">
      <span class="text-sm" style="line-height: 1;">${isGold ? "📜" : "🌾"}</span>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

// Helper component to keep map viewport centered and displaced
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (map && center && !isNaN(center[0]) && !isNaN(center[1])) {
      const currentZoom = map.getZoom();
      const targetZoom = currentZoom < 10 ? 12 : currentZoom;
      map.flyTo(center, targetZoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [map, center[0], center[1]]);
  return null;
}

// Click listener helper for location selection (Picker mode)
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

interface AgriculturalMapProps {
  mode: "picker" | "display-single" | "display-multi";
  onLocationSelect?: (data: {
    lat: number;
    lng: number;
    address: string;
    weather?: LiveWeather;
  }) => void;
  initialLat?: number;
  initialLng?: number;
  items?: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    latitude?: number;
    longitude?: number;
    badge?: string;
    badgeColor?: "green" | "gold" | "emerald" | "amber";
    onClickButton?: () => void;
    buttonText?: string;
    price?: string;
    quantity?: string;
    farmerName?: string;
    score?: number;
  }>;
  height?: string;
}

export default function AgriculturalMap({
  mode,
  onLocationSelect,
  initialLat,
  initialLng,
  items = [],
  height = "350px",
}: AgriculturalMapProps) {
  // Default coordinates: Meru, Kenya
  const defaultCenter: [number, number] = [0.0515, 37.6456];
  
  const [center, setCenter] = useState<[number, number]>(
    initialLat && initialLng ? [initialLat, initialLng] : defaultCenter
  );

  const [pickerMarker, setPickerMarker] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [localWeather, setLocalWeather] = useState<LiveWeather | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [gpsWarning, setGpsWarning] = useState<string | null>(null);

  const handleSearchAddress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingAddress(true);
    try {
      const result = await geocodeAddress(searchQuery);
      if (result) {
        const coords: [number, number] = [result.lat, result.lng];
        setCenter(coords);
        setPickerMarker(coords);
        setCurrentAddress(result.address);
        
        // Fetch weather
        const weather = await fetchLiveWeather(result.lat, result.lng).catch(() => undefined);
        if (weather) {
          setLocalWeather(weather);
        }

        if (onLocationSelect) {
          onLocationSelect({
            lat: result.lat,
            lng: result.lng,
            address: result.address,
            weather,
          });
        }
      } else {
        alert("Location not found. Please try a more specific address or region.");
      }
    } catch (err) {
      console.error("Error searching address:", err);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Sync initial coordinates if they change from external props
  useEffect(() => {
    if (initialLat !== undefined && initialLng !== undefined) {
      const coords: [number, number] = [initialLat, initialLng];
      setCenter(coords);
      if (mode === "picker") {
        setPickerMarker(coords);
        handleLocationSelect(initialLat, initialLng);
      }
    }
  }, [initialLat, initialLng]);

  // Center when items change (Multi or Single display mode)
  useEffect(() => {
    if (mode !== "picker" && items && items.length > 0) {
      const validItems = items.filter(item => item.latitude !== undefined && item.longitude !== undefined);
      if (validItems.length === 1 && validItems[0].latitude !== undefined && validItems[0].longitude !== undefined) {
        setCenter([validItems[0].latitude, validItems[0].longitude]);
      } else if (validItems.length > 1) {
        const avgLat = validItems.reduce((acc, v) => acc + (v.latitude || 0), 0) / validItems.length;
        const avgLng = validItems.reduce((acc, v) => acc + (v.longitude || 0), 0) / validItems.length;
        setCenter([avgLat, avgLng]);
      }
    }
  }, [items, mode]);

  // Handle location picking (reverse geocoding and fetching weather)
  const handleLocationSelect = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    setPickerMarker([lat, lng]);
    try {
      const [address, weather] = await Promise.all([
        reverseGeocodeCoords(lat, lng),
        fetchLiveWeather(lat, lng).catch(() => undefined),
      ]);

      setCurrentAddress(address);
      if (weather) {
        setLocalWeather(weather);
      }

      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          address,
          weather,
        });
      }
    } catch (err) {
      console.error("Error updating location details:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Browser Geolocation
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setGpsWarning("Geolocation is not supported by your browser. Falling back to Abuja regional center.");
      const fallbackLat = 9.0765;
      const fallbackLng = 7.3986;
      setCenter([fallbackLat, fallbackLng]);
      handleLocationSelect(fallbackLat, fallbackLng);
      setTimeout(() => setGpsWarning(null), 7000);
      return;
    }

    setIsLoadingGPS(true);
    setGpsWarning(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCenter([lat, lng]);
        handleLocationSelect(lat, lng);
        setIsLoadingGPS(false);
      },
      (error) => {
        console.warn("GPS retrieval failed:", error);
        // Resilient fallback to regional capital Abuja
        const fallbackLat = 9.0765;
        const fallbackLng = 7.3986;
        setGpsWarning("GPS access restricted or unavailable in this environment. Falling back to Abuja regional center.");
        setCenter([fallbackLat, fallbackLng]);
        handleLocationSelect(fallbackLat, fallbackLng);
        setIsLoadingGPS(false);
        setTimeout(() => setGpsWarning(null), 7000);
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  };

  return (
    <div className="space-y-3.5" id="agri-map-root">
      {gpsWarning && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-left animate-in fade-in duration-300">
          <Sparkles className="text-amber-600 shrink-0 animate-pulse" size={16} />
          <span>{gpsWarning}</span>
        </div>
      )}
      {/* Geolocation toolbar for Picker Mode */}
      {mode === "picker" && (
        <div className="flex flex-col gap-2.5">
          {/* Geocoding text input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchAddress();
                  }
                }}
                placeholder="Type location (e.g. Kano, Nigeria; Nairobi, Kenya; Austin, Texas)..."
                className="w-full bg-white border border-gray-200 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 pl-9 text-xs outline-none font-semibold transition-all shadow-2xs"
              />
              <Search className="absolute left-3.5 top-3 text-gray-400" size={14} />
            </div>
            <button
              type="button"
              onClick={() => handleSearchAddress()}
              disabled={isSearchingAddress}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-900/50 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
            >
              {isSearchingAddress ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Search size={14} />
              )}
              Search Location
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={isLoadingGPS}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-900/50 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-sm"
              id="btn-gps-map"
            >
              {isLoadingGPS ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Navigation size={14} />
              )}
              Use Current Location (GPS)
            </button>
            
            <div className="flex-1 bg-gray-50 border border-gray-150 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <MapPin size={14} className="text-emerald-700 shrink-0" />
              <div className="text-left overflow-hidden">
                <span className="text-[9px] text-gray-400 font-bold block leading-none uppercase">REVERSE GEOCODED ADDRESS</span>
                <span className="text-xs text-gray-700 font-semibold truncate block">
                  {isGeocoding ? "Identifying location..." : currentAddress || "Click on the map or GPS to select location"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick preset locations */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Quick Regions:</span>
            {[
              { name: "Kano, NG", lat: 11.99, lng: 8.51 },
              { name: "Oyo / Ibadan, NG", lat: 8.11, lng: 3.42 },
              { name: "Enugu, NG", lat: 6.45, lng: 7.52 },
              { name: "Benue, NG", lat: 7.73, lng: 8.52 },
              { name: "Meru, KE", lat: 0.05, lng: 37.64 },
              { name: "Eldoret, KE", lat: 0.51, lng: 35.28 },
              { name: "Nakuru, KE", lat: -0.30, lng: 36.08 },
              { name: "Des Moines, US", lat: 41.58, lng: -93.62 },
            ].map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setCenter([preset.lat, preset.lng]);
                  setPickerMarker([preset.lat, preset.lng]);
                  handleLocationSelect(preset.lat, preset.lng);
                }}
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] font-bold text-gray-600 transition-all border border-gray-200 cursor-pointer"
              >
                📍 {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actual Map Canvas Container */}
      <div 
        className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-slate-100 z-10" 
        style={{ height }}
        id="agri-map-canvas"
      >
        <ErrorBoundary>
          <MapContainer
            center={center}
            zoom={mode === "picker" ? 14 : items.length > 1 ? 6 : 12}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapRecenter center={center} />

            {/* Picker Mode Interactive Pin */}
            {mode === "picker" && pickerMarker && (
              <Marker
                position={pickerMarker}
                icon={pickerIcon}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    handleLocationSelect(position.lat, position.lng);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-xs">
                    <p className="font-bold text-gray-800">🚜 Chosen Harvest Location</p>
                    <p className="text-gray-500 mt-1">Drag me or click elsewhere on the map to change.</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Click listener in picker mode */}
            {mode === "picker" && (
              <MapClickHandler onClick={(lat, lng) => handleLocationSelect(lat, lng)} />
            )}

            {/* Display Modes Multi-Marker rendering */}
            {mode !== "picker" &&
              items
                .filter(item => item.latitude !== undefined && item.longitude !== undefined)
                .map(item => {
                  const lat = Number(item.latitude);
                  const lng = Number(item.longitude);
                  if (isNaN(lat) || isNaN(lng)) return null;

                  const isGold = item.badgeColor === "gold" || item.badgeColor === "amber";

                  return (
                    <Marker
                      key={item.id}
                      position={[lat, lng]}
                      icon={createItemIcon(isGold)}
                    >
                      <Popup>
                        <div className="p-1.5 max-w-[220px] font-sans text-left space-y-2">
                          <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-1.5">
                            <div>
                              <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                                {item.badge || "Harvest"}
                              </span>
                              <h4 className="text-xs font-extrabold text-gray-900 mt-1 line-clamp-1">{item.title}</h4>
                              <p className="text-[10px] text-gray-500 font-semibold">{item.subtitle}</p>
                            </div>
                          </div>

                          <div className="space-y-1 text-[11px] text-gray-600">
                            {item.price && (
                              <p className="flex justify-between">
                                <span className="text-gray-400">Price:</span>
                                <strong className="font-bold text-emerald-800">{item.price}</strong>
                              </p>
                            )}
                            {item.quantity && (
                              <p className="flex justify-between">
                                <span className="text-gray-400">Quantity:</span>
                                <strong className="font-bold text-gray-800">{item.quantity}</strong>
                              </p>
                            )}
                            {item.farmerName && (
                              <p className="flex justify-between">
                                <span className="text-gray-400">Seller:</span>
                                <strong className="font-semibold text-gray-700">{item.farmerName}</strong>
                              </p>
                            )}
                            {item.score !== undefined && (
                              <p className="flex justify-between">
                                <span className="text-gray-400">Suitability:</span>
                                <strong className="font-bold text-amber-700">{item.score}% Score</strong>
                              </p>
                            )}
                            <p className="text-[10px] text-gray-500 italic line-clamp-2 mt-1">{item.description}</p>
                          </div>

                          {item.onClickButton && (
                            <button
                              onClick={() => {
                                if (item.onClickButton) item.onClickButton();
                              }}
                              className="w-full py-1 text-[10px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer text-center block mt-1"
                            >
                              {item.buttonText || "View Details"}
                            </button>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
          </MapContainer>
        </ErrorBoundary>
      </div>

      {/* Live Geocoded Weather Info Card inside Picker mode */}
      {mode === "picker" && localWeather && (
        <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-sm">{localWeather.icon}</span>
            <div className="text-left">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-950 bg-emerald-150 px-2 py-0.5 rounded-full uppercase mb-1">
                <Sparkles size={9} /> Real-Time Live Weather API
              </span>
              <h5 className="text-sm font-extrabold text-gray-800 leading-tight">
                Current Condition: {localWeather.description}
              </h5>
              <p className="text-[11px] text-gray-500 font-medium">
                Sourced instantly from coordinates: {pickerMarker?.[0].toFixed(4)}, {pickerMarker?.[1].toFixed(4)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2.5 w-full sm:w-auto text-center">
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-emerald-100/40 shadow-3xs">
              <span className="text-[8px] text-gray-400 font-bold block leading-none uppercase">TEMP</span>
              <span className="text-xs font-black text-gray-800">{localWeather.temperature}°C</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-emerald-100/40 shadow-3xs">
              <span className="text-[8px] text-gray-400 font-bold block leading-none uppercase">HUMIDITY</span>
              <span className="text-xs font-black text-gray-800">{localWeather.humidity}%</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-emerald-100/40 shadow-3xs">
              <span className="text-[8px] text-gray-400 font-bold block leading-none uppercase">PRECIP</span>
              <span className="text-xs font-black text-gray-800">{localWeather.precipitation}mm</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-emerald-100/40 shadow-3xs">
              <span className="text-[8px] text-gray-400 font-bold block leading-none uppercase">WIND</span>
              <span className="text-xs font-black text-gray-800">{localWeather.windSpeed}km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
