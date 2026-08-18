import { MapContainer, TileLayer, Polygon, Popup, LayersControl, Circle, FeatureGroup, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Certificate } from '../types';

// Fix for default Leaflet icon issues in React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Create custom SVGs for the dynamic farm pins
const createCustomIcon = (_cropName: string, isSelected: boolean) => {
  const colorClass = isSelected ? 'bg-emerald-600 ring-4 ring-emerald-200' : 'bg-slate-800 hover:bg-emerald-700';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10 rounded-full ${colorClass} border-2 border-white shadow-lg text-white font-bold transition-all duration-300 transform ${isSelected ? 'scale-110' : 'hover:scale-105'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout"><path d="M7 20h10"/><path d="M10 20c5.5-2.5 8-6.4 8-12a4 4 0 0 0-8 0c0 5.6 2.5 9.5 8 12Z"/><path d="M14 20c-5.5-2.5-8-6.4-8-12a4 4 0 0 1 8 0c0 5.6-2.5 9.5-8 12Z"/></svg>
        ${isSelected ? '<span class="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 border border-white text-[9px] font-black text-slate-900 shadow-sm animate-bounce">★</span>' : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

// Map panning helper component
function MapRecenter({ selectedCert }: { selectedCert: Certificate | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCert && selectedCert.latitude !== undefined && selectedCert.longitude !== undefined) {
      map.setView([selectedCert.latitude, selectedCert.longitude], 13, { animate: true });
    }
  }, [selectedCert, map]);
  return null;
}

// Default center (e.g. Kano state, Nigeria)
const defaultCenter: [number, number] = [11.99, 8.51];

// Farm boundaries around centers
const fieldA: [number, number][] = [
  [11.995, 8.505],
  [11.995, 8.515],
  [11.985, 8.515],
  [11.985, 8.505]
];

const fieldB: [number, number][] = [
  [11.995, 8.516],
  [11.995, 8.525],
  [11.985, 8.525],
  [11.985, 8.516]
];

// Soil health heatmap data (simulated with circles)
const soilData = [
  { pos: [11.992, 8.510] as [number, number], health: 'high', val: 85 },
  { pos: [11.990, 8.508] as [number, number], health: 'moderate', val: 65 },
  { pos: [11.988, 8.512] as [number, number], health: 'high', val: 90 },
  { pos: [11.987, 8.507] as [number, number], health: 'low', val: 40 },
  { pos: [11.992, 8.520] as [number, number], health: 'low', val: 35 },
  { pos: [11.988, 8.522] as [number, number], health: 'moderate', val: 70 },
  { pos: [11.990, 8.518] as [number, number], health: 'high', val: 88 },
];

const getColorForHealth = (health: string) => {
  switch(health) {
    case 'high': return '#10b981'; // Emerald 500
    case 'moderate': return '#eab308'; // Yellow 500
    case 'low': return '#ef4444'; // Red 500
    default: return '#3b82f6';
  }
};

interface GISMapProps {
  certificates: Certificate[];
  onSelectCertificate: (cert: Certificate) => void;
  selectedCertificate: Certificate | null;
}

export default function GISMap({ certificates, onSelectCertificate, selectedCertificate }: GISMapProps) {
  return (
    <div className="w-full h-full relative" style={{ zIndex: 1, isolation: 'isolate' }}>
      <MapContainer 
        center={selectedCertificate && selectedCertificate.latitude !== undefined && selectedCertificate.longitude !== undefined 
          ? [selectedCertificate.latitude, selectedCertificate.longitude] 
          : defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 1 }}
        zoomControl={true}
      >
        <MapRecenter selectedCert={selectedCertificate} />
        
        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked name="Satellite Imagery">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Topographic">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
            />
          </LayersControl.BaseLayer>

          {/* Certificates Markers */}
          <LayersControl.Overlay checked name="Certified Farms">
            <FeatureGroup>
              {certificates.map((cert) => {
                if (cert.latitude === undefined || cert.longitude === undefined) return null;
                const isSelected = selectedCertificate?.id === cert.id;
                const customIcon = createCustomIcon(cert.cropName, isSelected);
                return (
                  <Marker
                    key={cert.id}
                    position={[cert.latitude, cert.longitude]}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => {
                        onSelectCertificate(cert);
                      }
                    }}
                  >
                    <Popup>
                      <div className="font-sans p-1">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full uppercase block w-max mb-1">
                          Verified Farm
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm">{cert.farmerName}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">Crop: <strong className="text-emerald-700">{cert.cropName}</strong></p>
                        <p className="text-xs text-gray-500">{cert.location}</p>
                        <button 
                          onClick={() => onSelectCertificate(cert)}
                          className="mt-2.5 w-full bg-emerald-600 text-white text-xs py-1.5 px-3 rounded-xl hover:bg-emerald-700 font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                          View Certificate Details →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </FeatureGroup>
          </LayersControl.Overlay>

          {/* Field Boundaries */}
          <LayersControl.Overlay checked name="Field Boundaries">
            <FeatureGroup>
              <Polygon positions={fieldA} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 2 }}>
                <Popup>
                  <div className="font-sans">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Field Alpha (Musa Ibrahim)</h4>
                    <p className="text-xs text-gray-600 mb-0">Crop: <strong>Sorghum</strong></p>
                    <p className="text-xs text-gray-600 mb-0">Area: <strong>1.2 Hectares</strong></p>
                    <p className="text-xs text-emerald-600 font-semibold">Status: Growing phase</p>
                  </div>
                </Popup>
              </Polygon>
              <Polygon positions={fieldB} pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.15, weight: 2 }}>
                <Popup>
                  <div className="font-sans">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Field Beta (O Oyo Cassava Field)</h4>
                    <p className="text-xs text-gray-600 mb-0">Crop: <strong>Cassava</strong></p>
                    <p className="text-xs text-gray-600 mb-0">Area: <strong>0.9 Hectares</strong></p>
                    <p className="text-xs text-amber-600 font-semibold">Status: Optimal health</p>
                  </div>
                </Popup>
              </Polygon>
            </FeatureGroup>
          </LayersControl.Overlay>

          {/* Soil Health Heatmap */}
          <LayersControl.Overlay checked name="Soil Health (N-P-K)">
            <FeatureGroup>
              {soilData.map((node, i) => (
                <Circle 
                  key={i} 
                  center={node.pos} 
                  radius={120} 
                  pathOptions={{ 
                    color: getColorForHealth(node.health), 
                    fillColor: getColorForHealth(node.health), 
                    fillOpacity: 0.4,
                    weight: 0 
                  }}
                >
                  <Popup>
                    <div className="font-sans text-center">
                      <p className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wider">Nitrogen Level</p>
                      <p className="text-xl font-black mb-0" style={{ color: getColorForHealth(node.health) }}>
                        {node.val}%
                      </p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}
