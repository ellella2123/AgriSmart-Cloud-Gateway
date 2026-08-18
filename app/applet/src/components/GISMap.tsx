import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, LayersControl, Circle, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sample coordinates around a central farm location (e.g. Kano state, Nigeria)
const center: [number, number] = [11.99, 8.51];

// Farm boundaries
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
// Green = High Nitrogen, Yellow = Moderate, Red = Low
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

export default function GISMap() {
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'street' | 'topo'>('satellite');

  return (
    <div className="w-full h-full relative" style={{ zIndex: 1 }}>
      <MapContainer 
        center={center} 
        zoom={14} 
        style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        zoomControl={false}
      >
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

          {/* Field Boundaries */}
          <LayersControl.Overlay checked name="Field Boundaries">
            <FeatureGroup>
              <Polygon positions={fieldA} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2, weight: 2 }}>
                <Popup>
                  <div className="font-sans">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Field Alpha (North-West)</h4>
                    <p className="text-xs text-gray-600 mb-0">Crop: <strong>Sorghum</strong></p>
                    <p className="text-xs text-gray-600 mb-0">Area: <strong>1.2 Hectares</strong></p>
                    <p className="text-xs text-emerald-600 font-semibold">Status: Growing phase</p>
                  </div>
                </Popup>
              </Polygon>
              <Polygon positions={fieldB} pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.2, weight: 2 }}>
                <Popup>
                  <div className="font-sans">
                    <h4 className="font-bold text-gray-800 text-sm mb-1">Field Beta (North-East)</h4>
                    <p className="text-xs text-gray-600 mb-0">Crop: <strong>Cassava</strong></p>
                    <p className="text-xs text-gray-600 mb-0">Area: <strong>0.9 Hectares</strong></p>
                    <p className="text-xs text-amber-600 font-semibold">Status: Needs fertilizer</p>
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
                  radius={150} 
                  pathOptions={{ 
                    color: getColorForHealth(node.health), 
                    fillColor: getColorForHealth(node.health), 
                    fillOpacity: 0.5,
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
