import { useState } from "react";
import { Users, ClipboardList, Map as MapIcon, BookOpen, UserCheck, AlertTriangle, X, CheckCircle } from "lucide-react";

interface FarmVisit {
  name: string;
  location: string;
  crop: string;
  status: "Healthy" | "Needs Fertilizer" | "Pest Alert";
  date: string;
}

export default function ExtensionPortal() {
  const [visits, setVisits] = useState<FarmVisit[]>([
    { name: "Musa Ibrahim", location: "Kano", crop: "Sorghum", status: "Healthy", date: "Today" },
    { name: "Florence Ade", location: "Oyo", crop: "Cassava", status: "Needs Fertilizer", date: "Yesterday" },
    { name: "Emmanuel Oti", location: "Enugu", crop: "Maize", status: "Pest Alert", date: "2 days ago" },
  ]);

  const [showLogModal, setShowLogModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    crop: "Maize",
    status: "Healthy" as FarmVisit["status"]
  });

  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const handleOpenGuide = (guideName: string) => {
    setSelectedGuide(guideName === selectedGuide ? null : guideName);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      alert("Please fill in the Farmer Name and Location.");
      return;
    }

    const newVisit: FarmVisit = {
      name: formData.name,
      location: formData.location,
      crop: formData.crop,
      status: formData.status,
      date: "Just now"
    };

    setVisits(prev => [newVisit, ...prev]);
    setShowLogModal(false);
    setFormData({ name: "", location: "", crop: "Maize", status: "Healthy" });
    
    setAlertMsg(`Farm visit for ${newVisit.name} logged successfully!`);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const guidesContent: Record<string, string> = {
    "Climate-Smart Agriculture Guide v2": "Focuses on minimum soil disturbance, crop rotation, and cover cropping. Learn how to maintain soil moisture during prolonged dry spells using localized grass mulching.",
    "New Fall Armyworm Protocols": "Identifies early infestation of Spodoptera frugiperda. Emphasizes chemical-free Neem seed oil treatments (30ml per Liter of water) applied directly into the whorl at sunset.",
    "Soil Sampling Best Practices": "Detailed guide on gathering topsoil in an 'S' or zigzag pattern at 15cm depths. Learn how to package samples and avoid contamination prior to spectroscopy scans."
  };

  // Compute stats dynamically
  const surveysCompletedCount = 85 + (visits.length - 3);
  const diseaseAlertsCount = visits.filter(v => v.status === "Pest Alert").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500" id="extension-portal-root">
      
      {/* Alert Banner */}
      {alertMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex items-center gap-2.5 shadow-3xs animate-pulse text-left">
          <CheckCircle className="text-emerald-700 shrink-0" size={18} />
          <span className="text-xs font-bold">{alertMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Extension Officer Portal</h2>
          <p className="text-sm text-gray-500 mt-1">Manage field visits, conduct digital land surveys, and disseminate smart training.</p>
        </div>
        <button 
          onClick={() => setShowLogModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <UserCheck size={16} /> Log New Farm Visit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="extension-stats">
        {[
          { label: "Assigned Farmers", value: "142", icon: Users, color: "text-blue-600", bg: "bg-blue-100/60" },
          { label: "Pending Visits", value: "15", icon: MapIcon, color: "text-amber-600", bg: "bg-amber-100/60" },
          { label: "Surveys Completed", value: surveysCompletedCount.toString(), icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-100/60" },
          { label: "Active Disease Alerts", value: diseaseAlertsCount.toString(), icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-100/60" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-3xs flex items-center gap-4 text-left">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Visits list */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 shadow-sm p-6 text-left">
          <h3 className="text-base font-extrabold text-gray-950 mb-5">Recent Farm Visits & Logs</h3>
          <div className="space-y-3.5">
            {visits.map((visit, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50/60 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">{visit.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{visit.location} • {visit.crop}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                    visit.status === "Healthy" ? "bg-emerald-100 text-emerald-800 border border-emerald-200/20" :
                    visit.status === "Pest Alert" ? "bg-rose-100 text-rose-800 border border-rose-200/20" : "bg-amber-100 text-amber-800 border border-amber-200/20"
                  }`}>
                    {visit.status}
                  </span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">{visit.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Materials Panel */}
        <div className="bg-slate-950 rounded-3xl p-6 text-white shadow-lg text-left flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Field Training Materials</h3>
            <div className="space-y-3">
              {[
                "Climate-Smart Agriculture Guide v2",
                "New Fall Armyworm Protocols",
                "Soil Sampling Best Practices"
              ].map((doc, i) => (
                <div 
                  key={i} 
                  onClick={() => handleOpenGuide(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedGuide === doc 
                      ? "bg-slate-800 border-indigo-500 shadow-sm" 
                      : "bg-slate-900 border-slate-800 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-xs font-bold text-slate-200">{doc}</p>
                  </div>
                  {selectedGuide === doc && (
                    <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2.5 animate-in fade-in duration-200">
                      {guidesContent[doc]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-semibold mt-6">
            * Content auto-syncs with the regional Agricultural Extension Bureau.
          </p>
        </div>
      </div>

      {/* MODAL: LOG VISIT FORM */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-150 overflow-hidden text-left animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-extrabold text-gray-900">Log Field Visit</h3>
              <button 
                onClick={() => setShowLogModal(false)}
                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleLogVisit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Farmer Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Florence Ade"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Location / Community</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Oyo State"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Primary Crop</label>
                  <select 
                    name="crop"
                    value={formData.crop}
                    onChange={handleFormChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="Maize">Maize / Corn</option>
                    <option value="Sorghum">Sorghum</option>
                    <option value="Cassava">Cassava</option>
                    <option value="Avocado">Avocado</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Health Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Needs Fertilizer">Needs Fertilizer</option>
                    <option value="Pest Alert">Pest Alert</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer mt-2"
              >
                Log Visit Entry
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
