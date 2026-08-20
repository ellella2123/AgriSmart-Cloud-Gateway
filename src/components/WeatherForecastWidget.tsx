import { useState, useEffect, useCallback } from "react";
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Locate,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Flame,
  Snowflake,
  ShieldAlert,
  Compass,
  Gauge,
  CalendarDays,
  Sparkles,
  Info
} from "lucide-react";
import {
  FiveDayWeatherForecast,
  DailyForecast,
  fetchFiveDayWeather,
  geocodeAddress
} from "../utils/weather";

interface WeatherForecastWidgetProps {
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  onLocationSelected?: (lat: number, lng: number, address: string) => void;
  className?: string;
  compact?: boolean;
}

export default function WeatherForecastWidget({
  initialLat,
  initialLng,
  initialLocationName,
  onLocationSelected,
  className = "",
  compact = false
}: WeatherForecastWidgetProps) {
  const [lat, setLat] = useState<number>(initialLat ?? 11.99); // Default Kano / Rift Valley region
  const [lng, setLng] = useState<number>(initialLng ?? 8.51);
  const [locationName, setLocationName] = useState<string>(initialLocationName ?? "Kano State Agricultural Zone");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [forecast, setForecast] = useState<FiveDayWeatherForecast | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeAlertFilter, setActiveAlertFilter] = useState<"all" | "temperature" | "precipitation" | "wind">("all");
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Sync with prop changes if provided
  useEffect(() => {
    if (initialLat !== undefined && initialLng !== undefined) {
      setLat(initialLat);
      setLng(initialLng);
      if (initialLocationName) setLocationName(initialLocationName);
    }
  }, [initialLat, initialLng, initialLocationName]);

  const loadWeather = useCallback(async (targetLat: number, targetLng: number, name?: string) => {
    setIsLoading(true);
    setLocationError(null);
    try {
      const data = await fetchFiveDayWeather(targetLat, targetLng, name);
      setForecast(data);
      if (name) {
        setLocationName(name);
      } else if (data.location.name) {
        setLocationName(data.location.name);
      }
    } catch (err: any) {
      console.error("Failed to load 5-day weather:", err);
      setLocationError("Could not retrieve latest satellite feed. Using cached telemetry.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(lat, lng, locationName);
  }, [lat, lng, loadWeather]);

  // Handle Geolocation with vibration and sensor feedback
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser/device.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    // Haptic sensor pulse if available
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
        setIsLocating(false);

        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(150);
        }

        // Notify parent if callback provided
        if (onLocationSelected) {
          onLocationSelected(latitude, longitude, `GPS Location (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`);
        }
        await loadWeather(latitude, longitude);
      },
      (error) => {
        setIsLocating(false);
        let msg = "Could not obtain current GPS position.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission was denied. You can search your farm town or region above.";
        }
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLocationError(null);
    try {
      const result = await geocodeAddress(searchQuery.trim());
      if (result) {
        setLat(result.lat);
        setLng(result.lng);
        setLocationName(result.address);
        setSearchQuery("");
        if (onLocationSelected) {
          onLocationSelected(result.lat, result.lng, result.address);
        }
        await loadWeather(result.lat, result.lng, result.address);
      } else {
        setLocationError(`No agricultural coordinates found for "${searchQuery}". Please try another locality.`);
      }
    } catch (err) {
      setLocationError("Search query failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectedDay: DailyForecast | undefined = forecast?.daily?.[selectedDayIndex];

  const filteredAlerts = (forecast?.alerts || []).filter((a) => {
    if (activeAlertFilter === "all") return true;
    return a.category === activeAlertFilter;
  });

  return (
    <div
      className={`bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden transition-all duration-300 ${className}`}
      id="five-day-weather-widget"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 md:p-6 relative overflow-hidden">
        {/* Background Subtle Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-radial-gradient from-emerald-400 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-700/60 text-emerald-200 border border-emerald-600/40 uppercase tracking-wider">
                <CloudSun size={13} className="text-emerald-300" />
                Agro-Meteorology Hub
              </span>
              <span className="text-[11px] text-emerald-200/70 font-mono">
                5-Day Localized Satellite Feed
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Precision Weather & Agronomic Alerts
            </h2>
            <p className="text-xs text-emerald-100/80 flex items-center gap-1.5 flex-wrap">
              <MapPin size={13} className="text-emerald-400 shrink-0" />
              <span className="font-semibold text-white">{locationName}</span>
              <span className="text-emerald-300/60 text-[10px] font-mono">
                ({lat.toFixed(3)}°N, {lng.toFixed(3)}°E)
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Use current GPS position"
              id="btn-detect-gps-weather"
            >
              <Locate size={14} className={isLocating ? "animate-spin text-emerald-200" : ""} />
              {isLocating ? "Locating..." : "Use My GPS"}
            </button>

            <button
              onClick={() => loadWeather(lat, lng, locationName)}
              disabled={isLoading}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
              title="Refresh telemetry"
              id="btn-refresh-weather"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
              title={isExpanded ? "Collapse widget" : "Expand widget"}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Location Search Bar within Header */}
        <form onSubmit={handleSearchLocation} className="mt-4 flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm city or state (e.g. Eldoret, Iowa, Kano)..."
              className="w-full bg-emerald-950/70 border border-emerald-700/50 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-emerald-300/50 focus:outline-none focus:border-emerald-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0"
          >
            {isSearching ? "Searching..." : "Set Location"}
          </button>
        </form>

        {locationError && (
          <div className="mt-3 text-xs bg-amber-500/20 border border-amber-400/30 text-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Info size={14} className="shrink-0 text-amber-300" />
            <span>{locationError}</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-5 md:p-6 space-y-6">
          {/* 1. REAL-TIME ATMOSPHERIC CURRENT METRICS */}
          {forecast && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Sun size={14} className="text-amber-500" /> Current Temp
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-gray-900 tracking-tight flex items-baseline gap-1">
                    {Math.round(forecast.current.temperature)}°C
                    <span className="text-xs font-medium text-gray-500">
                      {forecast.current.condition}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    Feels like {Math.round(forecast.current.apparentTemperature)}°C
                  </span>
                </div>
              </div>

              <div className="bg-blue-50/60 border border-blue-100/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-blue-800 flex items-center gap-1.5">
                  <Droplets size={14} className="text-blue-500" /> Rel. Humidity
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                    {forecast.current.humidity}%
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {forecast.current.humidity > 70 ? "High (Fungal Risk)" : forecast.current.humidity < 35 ? "Low (Fast Evap)" : "Optimal Zone"}
                  </span>
                </div>
              </div>

              <div className="bg-sky-50/60 border border-sky-100/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-sky-800 flex items-center gap-1.5">
                  <CloudRain size={14} className="text-sky-600" /> Today's Rain
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                    {forecast.current.precipitation.toFixed(1)} <span className="text-xs font-medium text-gray-500">mm</span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {forecast.current.precipitation > 5 ? "Significant Rainfall" : "Minimal Precipitation"}
                  </span>
                </div>
              </div>

              <div className="bg-teal-50/60 border border-teal-100/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-teal-800 flex items-center gap-1.5">
                  <Wind size={14} className="text-teal-600" /> Wind Velocity
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                    {Math.round(forecast.current.windSpeed)} <span className="text-xs font-medium text-gray-500">km/h</span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {forecast.current.windSpeed < 15 ? "Calm: Safe for Spray" : "Breezy: Spray Drift Risk"}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-100/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> Max UV Index
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                    {forecast.daily[0]?.uvIndexMax || 6} <span className="text-xs font-medium text-gray-500">/ 11</span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {(forecast.daily[0]?.uvIndexMax || 6) >= 8 ? "Very High Solar Flux" : "Moderate Radiation"}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50/60 border border-purple-100/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-purple-800 flex items-center gap-1.5">
                  <Gauge size={14} className="text-purple-600" /> Barometer
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                    {forecast.current.pressure || 1013} <span className="text-xs font-medium text-gray-500">hPa</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Atmospheric Stability</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. LOCALIZED PRECIPITATION & TEMPERATURE ALERTS */}
          {forecast && forecast.alerts.length > 0 && (
            <div className="space-y-3" id="weather-alerts-section">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-amber-600" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                    Active Localized Agronomic Alerts ({forecast.alerts.length})
                  </h3>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-1 bg-gray-100/80 p-1 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => setActiveAlertFilter("all")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeAlertFilter === "all" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    All ({forecast.alerts.length})
                  </button>
                  <button
                    onClick={() => setActiveAlertFilter("temperature")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeAlertFilter === "temperature" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    🌡️ Temp
                  </button>
                  <button
                    onClick={() => setActiveAlertFilter("precipitation")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeAlertFilter === "precipitation" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    🌧️ Rain
                  </button>
                  <button
                    onClick={() => setActiveAlertFilter("wind")}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeAlertFilter === "wind" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    💨 Wind
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAlerts.map((alert) => {
                  let alertBorder = "border-amber-200 bg-amber-50/70 text-amber-900";
                  let badgeBg = "bg-amber-100 text-amber-800 border-amber-300";
                  let Icon = AlertTriangle;

                  if (alert.severity === "danger") {
                    alertBorder = "border-red-200 bg-red-50/70 text-red-950";
                    badgeBg = "bg-red-100 text-red-800 border-red-300";
                    Icon = alert.category === "temperature" ? Flame : AlertTriangle;
                  } else if (alert.severity === "favorable") {
                    alertBorder = "border-emerald-200 bg-emerald-50/70 text-emerald-950";
                    badgeBg = "bg-emerald-100 text-emerald-800 border-emerald-300";
                    Icon = CheckCircle2;
                  } else if (alert.category === "temperature" && alert.metric?.includes("low")) {
                    Icon = Snowflake;
                  }

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border ${alertBorder} flex flex-col justify-between space-y-2 transition-all hover:shadow-xs`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="p-1.5 rounded-xl bg-white/80 shadow-xs shrink-0 mt-0.5">
                            <Icon size={16} className={alert.severity === "danger" ? "text-red-600" : alert.severity === "favorable" ? "text-emerald-600" : "text-amber-600"} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-gray-900">{alert.title}</h4>
                              {alert.metric && (
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeBg}`}>
                                  {alert.metric}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-700 mt-1 leading-relaxed">{alert.message}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Directive */}
                      <div className="pt-2 border-t border-black/5 flex items-start gap-1.5 text-[11px] font-medium text-gray-800">
                        <span className="font-bold text-emerald-800 shrink-0">Field Action:</span>
                        <span>{alert.action}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. FIVE-DAY DETAILED CARDS CAROUSEL / GRID */}
          {forecast && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-emerald-700 shrink-0" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                    5-Day Agricultural Weather Outlook
                  </h3>
                </div>
                <span className="text-[11px] sm:text-xs text-gray-500">
                  Click any day for precision agronomy & spraying advice
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                {forecast.daily.map((day, idx) => {
                  const isSelected = selectedDayIndex === idx;
                  const rainPercentage = day.precipitationProbability;
                  const hasRain = day.precipitationSum > 1.0;

                  return (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDayIndex(idx)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                        isSelected
                          ? "bg-emerald-900 text-white border-emerald-950 shadow-md ring-2 ring-emerald-600/30"
                          : "bg-white hover:bg-gray-50/80 border-gray-150 text-gray-800 shadow-xs"
                      }`}
                    >
                      {/* Day Name & Date */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-xs font-bold uppercase tracking-wider block ${isSelected ? "text-emerald-200" : "text-gray-500"}`}>
                            {day.dayName}
                          </span>
                          <span className={`text-sm font-extrabold block ${isSelected ? "text-white" : "text-gray-900"}`}>
                            {day.formattedDate}
                          </span>
                        </div>
                        <span className="text-2xl" role="img" aria-label={day.condition}>
                          {day.icon}
                        </span>
                      </div>

                      {/* Temperature Range Bar */}
                      <div>
                        <div className="flex justify-between items-baseline text-xs mb-1 font-mono">
                          <span className={`font-bold ${isSelected ? "text-white text-sm" : "text-gray-900"}`}>
                            {Math.round(day.tempMax)}°
                          </span>
                          <span className={`text-[11px] ${isSelected ? "text-emerald-200/80" : "text-gray-400"}`}>
                            {Math.round(day.tempMin)}°
                          </span>
                        </div>

                        {/* High/Low Visual Bar */}
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isSelected ? "bg-emerald-800" : "bg-gray-150"}`}>
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 via-amber-400 to-red-500 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(20, (day.tempMax / 40) * 100))}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Rain Probability & Volume */}
                      <div className="space-y-1 pt-1 border-t border-current/10">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`flex items-center gap-1 ${isSelected ? "text-emerald-200" : "text-gray-500"}`}>
                            <Droplets size={11} className={hasRain ? (isSelected ? "text-sky-300" : "text-sky-500") : "text-gray-400"} />
                            Precip
                          </span>
                          <span className={`font-semibold font-mono ${hasRain ? (isSelected ? "text-sky-200 font-bold" : "text-sky-700 font-bold") : ""}`}>
                            {rainPercentage}% ({day.precipitationSum.toFixed(1)}mm)
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`flex items-center gap-1 ${isSelected ? "text-emerald-200" : "text-gray-500"}`}>
                            <Wind size={11} /> Wind
                          </span>
                          <span className="font-medium font-mono">
                            {Math.round(day.windSpeedMax)} km/h
                          </span>
                        </div>
                      </div>

                      {/* Agronomy Badge */}
                      <div className="pt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full block text-center truncate ${
                            isSelected
                              ? "bg-emerald-800/90 text-emerald-100 border border-emerald-700"
                              : day.farmingAdvice.sprayWindowStatus === "optimal"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : day.farmingAdvice.sprayWindowStatus === "prohibited"
                              ? "bg-red-50 text-red-800 border border-red-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {day.farmingAdvice.sprayWindowStatus === "optimal"
                            ? "🌱 Prime Work"
                            : day.farmingAdvice.sprayWindowStatus === "prohibited"
                            ? "🌧️ Rain / Wind Caution"
                            : "⚠️ Moderate Conditions"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. SELECTED DAY DEEP AGRONOMY DRILL-DOWN */}
          {selectedDay && (
            <div className="bg-gray-50/80 border border-gray-150 rounded-2xl p-4 md:p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedDay.icon}</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <span>{selectedDay.dayName} Agronomic Advisory Plan</span>
                      <span className="text-xs font-normal text-gray-500 font-mono">({selectedDay.formattedDate})</span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      Condition: {selectedDay.condition} | High: {Math.round(selectedDay.tempMax)}°C / Low: {Math.round(selectedDay.tempMin)}°C
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Suitability Index</span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    {selectedDay.farmingAdvice.agronomyScore} / 100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* 1. Irrigation Advisory */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-150 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Droplets size={14} className="text-blue-500" />
                      Moisture & Irrigation
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedDay.farmingAdvice.irrigationNeeded
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {selectedDay.farmingAdvice.irrigationNeeded ? "Irrigation Recommended" : "Irrigation Not Needed"}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDay.farmingAdvice.irrigationNote}
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono pt-1">
                    ET0 Evapotranspiration: ~{selectedDay.evapotranspiration?.toFixed(1) || "3.5"} mm/day
                  </div>
                </div>

                {/* 2. Spraying & Chemicals */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-150 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Wind size={14} className="text-teal-500" />
                      Foliar & Chemical Spraying
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedDay.farmingAdvice.sprayWindowStatus === "optimal"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : selectedDay.farmingAdvice.sprayWindowStatus === "caution"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {selectedDay.farmingAdvice.sprayWindowStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDay.farmingAdvice.sprayWindowNote}
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono pt-1">
                    Max Wind: {Math.round(selectedDay.windSpeedMax)} km/h | Rain Risk: {selectedDay.precipitationProbability}%
                  </div>
                </div>

                {/* 3. Field Work & Cultivation */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-150 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Compass size={14} className="text-emerald-600" />
                      Tractor & Manual Labor
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedDay.farmingAdvice.fieldWorkStatus === "good"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : selectedDay.farmingAdvice.fieldWorkStatus === "moderate"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {selectedDay.farmingAdvice.fieldWorkStatus === "good" ? "OPTIMAL PASS" : selectedDay.farmingAdvice.fieldWorkStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDay.farmingAdvice.fieldWorkNote}
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono pt-1">
                    UV Radiation: {selectedDay.uvIndexMax}/11 | Field Sowing Ready
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
