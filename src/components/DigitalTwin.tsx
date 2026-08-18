import { useState } from 'react';
import { Globe, Map, Layers, CloudRain, Cpu, X, User, MapPin, Sprout, Calendar, ShieldCheck, Thermometer, Droplets, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import GISMap from './GISMap';
import { Certificate } from '../types';

interface DigitalTwinProps {
  certificates?: Certificate[];
}

export default function DigitalTwin({ certificates = [] }: DigitalTwinProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Trigger grow simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationData(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationData({
        predictedYield: (3.8 + Math.random() * 0.8).toFixed(2),
        waterEfficiency: Math.floor(75 + Math.random() * 20),
        carbonSequestration: (1.2 + Math.random() * 0.5).toFixed(2)
      });
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 animate-in fade-in duration-500"> 
      <div className="p-4 sm:p-6 bg-white border-b border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Globe className="text-blue-600" /> Farm Digital Twin & GIS
          </h2>
          <p className="text-sm text-gray-500 mt-1">Satellite intelligence, weather simulation, and spatial analysis</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2">
            <Map size={14}/> Topography
          </button>
          <button className="px-4 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-2">
            <Layers size={14}/> NDVI Map
          </button>
          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-50 rounded-lg text-xs font-bold flex items-center gap-2"
          >
            <Cpu size={14} className={isSimulating ? "animate-spin" : ""} /> {isSimulating ? "Simulating..." : "Run Simulation"}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative flex overflow-hidden">
        {/* Left Sidebar Overlay for Stats */}
        <div className={`absolute top-4 left-4 z-20 w-72 space-y-4 pointer-events-none md:block transition-all duration-300 ${
          showMobileSidebar ? 'block' : 'hidden'
        }`}>
          {/* Certified Farms Quick-Select */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 pointer-events-auto">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600"/> GIS Certified Farms
            </h3>
            {certificates.length === 0 ? (
              <p className="text-xs text-gray-400">No certified farms found.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => {
                      setSelectedCert(cert);
                      // Reset simulation data on certificate change
                      setSimulationData(null);
                      setShowMobileSidebar(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all border ${
                      selectedCert?.id === cert.id
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-3xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-transparent text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`p-1 rounded-lg ${selectedCert?.id === cert.id ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        <Sprout size={12} />
                      </div>
                      <div className="truncate">
                        <span className="font-bold block truncate leading-none">{cert.farmerName}</span>
                        <span className="text-[10px] text-gray-400 font-medium truncate mt-0.5 block">{cert.cropName} • {cert.location}</span>
                      </div>
                    </div>
                    <ArrowRight size={12} className={`shrink-0 opacity-50 ${selectedCert?.id === cert.id ? 'translate-x-0.5 text-emerald-700' : ''}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 pointer-events-auto">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CloudRain size={14} className="text-blue-500"/> Weather Simulation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 font-medium">Precipitation Probability</span>
                <span className="text-sm font-bold text-blue-700">65%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-slate-600 font-medium">Soil Moisture</span>
                <span className="text-sm font-bold text-emerald-700">Optimal</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-700 pointer-events-auto text-white">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3">
              AI Yield Prediction
            </h3>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-black text-emerald-400">4.2</span>
              <span className="text-sm font-bold text-slate-400 pb-1">Tons / Ha</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Based on current weather, NDVI index, and soil carbon data.</p>
          </div>
        </div>

        {/* Map covering the area */}
        <div className="flex-1 w-full h-full bg-slate-200 p-2 sm:p-4 md:pl-80 z-10 relative">
          <GISMap 
            certificates={certificates}
            onSelectCertificate={(cert) => {
              setSelectedCert(cert);
              setSimulationData(null);
            }}
            selectedCertificate={selectedCert}
          />
        </div>

        {/* Mobile Toggle Sidebar Button */}
        <div className="absolute bottom-4 left-4 z-20 md:hidden pointer-events-auto">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer"
          >
            <ShieldCheck size={14} />
            {showMobileSidebar ? "Hide Farms Panel" : "View Certified Farms"}
          </button>
        </div>

        {/* Right Drawer - Certificate Details & Analysis */}
        {selectedCert && (
          <div className="absolute top-4 right-4 z-20 w-96 max-w-[calc(100vw-2rem)] h-[calc(100%-2rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-150 overflow-hidden flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                  Verified Crop Certificate
                </span>
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight mt-1">
                  Farm Intelligence
                </h3>
              </div>
              <button 
                onClick={() => setSelectedCert(null)}
                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Farmer Info */}
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/50 flex items-start gap-3">
                <div className="bg-emerald-600 p-2 rounded-lg text-white shrink-0 shadow-sm shadow-emerald-200">
                  <User size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-slate-900 leading-tight truncate">{selectedCert.farmerName}</h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {selectedCert.location}
                  </p>
                  <div className="mt-2 text-[10px] text-gray-400 font-mono flex items-center gap-1.5 bg-white/80 py-1 px-2 rounded-lg border border-gray-100">
                    <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                    <span className="truncate">Hash: {selectedCert.verificationHash || '0x4f128bc'}</span>
                  </div>
                </div>
              </div>

              {/* Crop & Soil Assessment */}
              <div className="space-y-2.5">
                <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Agronomic Diagnostics</h5>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block leading-none uppercase">TARGET CROP</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-1 flex items-center gap-1">
                      <Sprout size={14} className="text-emerald-600 shrink-0" /> {selectedCert.cropName}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block leading-none uppercase">SOIL STRUCTURE</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-1 block">
                      {selectedCert.soilType}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block leading-none uppercase">FERTILITY INDEX</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-1 flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${
                        selectedCert.fertilityStatus === 'Fertile' ? 'bg-emerald-500' :
                        selectedCert.fertilityStatus === 'Barren' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                      {selectedCert.fertilityStatus}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block leading-none uppercase">ASSESSMENT DATE</span>
                    <span className="text-xs font-extrabold text-slate-800 mt-1 flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400 shrink-0" /> {selectedCert.assessmentDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weather GIS overlay */}
              <div className="bg-slate-950 p-4 rounded-xl text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <CloudRain size={12} /> Microclimate Diagnostics
                  </span>
                  <div className="bg-blue-900/40 text-blue-300 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-800/40">
                    GIS Score: {selectedCert.weatherSuitabilityScore}%
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-800/60 pt-2">
                  <div>
                    <span className="text-[8px] text-slate-500 font-bold block leading-none uppercase">TEMP</span>
                    <span className="text-xs font-bold text-slate-100 mt-1 flex items-center justify-center gap-0.5">
                      <Thermometer size={11} className="text-amber-500" /> {selectedCert.temperature}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-bold block leading-none uppercase">HUMIDITY</span>
                    <span className="text-xs font-bold text-slate-100 mt-1 flex items-center justify-center gap-0.5">
                      <Droplets size={11} className="text-blue-500" /> {selectedCert.humidity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 font-bold block leading-none uppercase">RAINFALL</span>
                    <span className="text-xs font-bold text-slate-100 mt-1 block truncate">
                      {selectedCert.rainfall}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credit check eligibility */}
              <div className="p-3.5 rounded-xl border flex items-start gap-3 bg-blue-50/50 border-blue-100/50">
                <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0 shadow-sm shadow-blue-200">
                  <TrendingUp size={16} />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-extrabold text-slate-900 leading-tight">Financial Credit Rating</h5>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    This farm's verified ecological conditions have been evaluated for financial loan eligibility.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    {selectedCert.loanEligibility ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ✓ Approved for Agri-Loan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                        ⚠ Under Review
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expert notes */}
              {selectedCert.notes && (
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Evaluator Notes</h5>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed italic">
                    "{selectedCert.notes}"
                  </div>
                </div>
              )}

              {/* Growth Sim Output */}
              {simulationData && (
                <div className="bg-emerald-950 text-white p-3.5 rounded-xl space-y-2 border border-emerald-900 animate-in zoom-in-95 duration-200">
                  <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={11} className="animate-spin" /> Yield Simulation Complete
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center pt-1.5 border-t border-emerald-900/60">
                    <div>
                      <span className="text-[8px] text-emerald-500 font-bold block leading-none uppercase">PREDICTED YIELD</span>
                      <span className="text-sm font-black text-emerald-300 mt-1 block">{simulationData.predictedYield} T/Ha</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-emerald-500 font-bold block leading-none uppercase">WATER EFFICIENCY</span>
                      <span className="text-sm font-black text-emerald-300 mt-1 block">{simulationData.waterEfficiency}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer action */}
            <div className="p-3 bg-slate-50 border-t border-gray-100">
              <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-950/20 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Cpu size={14} className={isSimulating ? 'animate-spin' : ''} />
                {isSimulating ? 'Simulating growth parameters...' : 'Run Dynamic Crop Yield Simulation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
