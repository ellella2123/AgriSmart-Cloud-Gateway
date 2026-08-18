import { useState } from "react";
import { Settings, Activity, Users, Database, Server, Bell, RefreshCw, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [offlineFallback, setOfflineFallback] = useState(true);
  const [searchGrounding, setSearchGrounding] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, title: "Model Retraining Scheduled", desc: "XGBoost Credit Scoring model scheduled for Q3 updates.", time: "2 hours ago", urgent: false },
    { id: 2, title: "API Endpoint Optimization", desc: "Open-Meteo climate query latencies have decreased by 25%.", time: "5 hours ago", urgent: false }
  ]);

  const handleRetrain = () => {
    setIsRetraining(true);
    setRetrainProgress(0);
    
    const interval = setInterval(() => {
      setRetrainProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRetraining(false);
          setSystemAlerts(alerts => [
            { id: Date.now(), title: "Credit Scoring Retrained", desc: "Agricultural Credit Scoring model retrained successfully with Q3 farm logs.", time: "Just now", urgent: true },
            ...alerts
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500" id="admin-dashboard-root">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">System Administration Hub</h2>
          <p className="text-sm text-gray-500 mt-1">Configure role permissions, toggle AI grounding protocols, and monitor computing clusters.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM SERVICES ONLINE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="admin-stats">
        {[
          { label: "Active Nodes", value: "24,500+", icon: Users },
          { label: "API Requests/min", value: "12,450", icon: Activity },
          { label: "Database Core Load", value: "34%", icon: Database },
          { label: "Server Health Index", value: "99.99%", icon: Server },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-4 text-left">
            <div className="p-3 rounded-xl bg-slate-50 text-slate-700">
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Settings Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 p-6 space-y-6 shadow-sm text-left">
          <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <Settings className="text-slate-700" size={18} />
            Dynamic System Toggle Controllers
          </h3>
          
          <div className="divide-y divide-gray-100 space-y-4">
            
            <div className="flex items-center justify-between pb-4">
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-black text-gray-900">Resilient Offline-Heuristics Fallback</h4>
                <p className="text-[11px] text-gray-400 font-medium">Auto-triggers high-fidelity agronomic simulations when Gemini API keys are omitted or rate-limited.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={offlineFallback} 
                  onChange={(e) => setOfflineFallback(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="space-y-0.5 max-w-[80%]">
                <h4 className="text-xs font-black text-gray-900">Google Search Grounding</h4>
                <p className="text-[11px] text-gray-400 font-medium">Appends dynamic internet sources onto certificate evaluations for up-to-date pest outbreak alerts.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={searchGrounding} 
                  onChange={(e) => setSearchGrounding(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5 max-w-[70%]">
                <h4 className="text-xs font-black text-gray-900">Retrain Credit-Scoring Heuristics</h4>
                <p className="text-[11px] text-gray-400 font-medium">Re-calculates agricultural weight indexes using recent GIS maps, NDVI indexes, and regional yields.</p>
              </div>
              
              <button
                onClick={handleRetrain}
                disabled={isRetraining}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-100 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isRetraining ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    {retrainProgress}% Retraining...
                  </>
                ) : (
                  <>
                    <RefreshCw size={13} /> Run Retraining
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* System alerts panel */}
        <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <Bell className="text-indigo-600 animate-swing" size={18} />
            Live Infrastructure Alerts
          </h3>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                  alert.urgent ? "bg-rose-500 animate-ping" : "bg-blue-500"
                }`}></div>
                <div>
                  <p className="text-xs font-black text-gray-900">{alert.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed font-medium">{alert.desc}</p>
                  <p className="text-[9px] text-gray-400 mt-1 font-bold">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
