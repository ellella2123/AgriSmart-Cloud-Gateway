import { AdvancedMarker, Pin, InfoWindow, useMap } from "@vis.gl/react-google-maps";

export function MapElements({ mode, pickerMarker, items, handleLocationSelect, selectedItem, setSelectedItem }: any) {
  const map = useMap();
  if (!map) return null;

  return (
    <>
      {/* Picker Mode Interactive Pin */}
      {mode === "picker" && pickerMarker && (
        <AdvancedMarker
          position={pickerMarker}
          draggable
          onDragEnd={(e) => {
            if (e.latLng) {
              handleLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }
          }}
        >
          <Pin background="#047857" borderColor="#064e3b" glyphColor="#fff">
            <span className="text-xs">🚜</span>
          </Pin>
        </AdvancedMarker>
      )}

      {/* Display Modes Multi-Marker rendering */}
      {mode !== "picker" &&
        items
          .filter((item: any) => item.latitude !== undefined && item.longitude !== undefined)
          .map((item: any) => {
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;
            const isGold = item.badgeColor === "gold" || item.badgeColor === "amber";
            return (
              <AdvancedMarker
                key={item.id}
                position={{ lat, lng }}
                onClick={() => setSelectedItem(item)}
              >
                <Pin
                  background={isGold ? "#b45309" : "#047857"}
                  borderColor={isGold ? "#78350f" : "#064e3b"}
                  glyphColor="#fff"
                >
                  <span className="text-xs">{isGold ? "📜" : "🌾"}</span>
                </Pin>
              </AdvancedMarker>
            );
          })}

      {/* Interactive Info Window for clicked markers */}
      {selectedItem && selectedItem.latitude !== undefined && selectedItem.longitude !== undefined && (
        <InfoWindow
          position={{ lat: Number(selectedItem.latitude), lng: Number(selectedItem.longitude) }}
          onCloseClick={() => setSelectedItem(null)}
        >
          <div className="p-1 max-w-[220px] font-sans text-left space-y-2">
            <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-1.5">
              <div>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                  {selectedItem.badge || "Harvest"}
                </span>
                <h4 className="text-xs font-extrabold text-gray-900 mt-1 line-clamp-1">{selectedItem.title}</h4>
                <p className="text-[10px] text-gray-500 font-semibold">{selectedItem.subtitle}</p>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-gray-600">
              {selectedItem.price && (
                <p className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <strong className="font-bold text-emerald-800">{selectedItem.price}</strong>
                </p>
              )}
              {selectedItem.quantity && (
                <p className="flex justify-between">
                  <span className="text-gray-400">Quantity:</span>
                  <strong className="font-bold text-gray-800">{selectedItem.quantity}</strong>
                </p>
              )}
              {selectedItem.farmerName && (
                <p className="flex justify-between">
                  <span className="text-gray-400">Seller:</span>
                  <strong className="font-semibold text-gray-700">{selectedItem.farmerName}</strong>
                </p>
              )}
              {selectedItem.score !== undefined && (
                <p className="flex justify-between">
                  <span className="text-gray-400">Suitability:</span>
                  <strong className="font-bold text-amber-700">{selectedItem.score}% Score</strong>
                </p>
              )}
              <p className="text-[10px] text-gray-500 italic line-clamp-2 mt-1">{selectedItem.description}</p>
            </div>

            {selectedItem.onClickButton && (
              <button
                onClick={() => {
                  selectedItem.onClickButton();
                  setSelectedItem(null);
                }}
                className="w-full py-1 text-[10px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer text-center block mt-1"
              >
                {selectedItem.buttonText || "View Details"}
              </button>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
