import { useState } from "react";
import { Target, Heart, Award, Leaf, Download, Plus, X, CheckCircle, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  region: string;
  enrolled: number;
  status: "Active" | "Completed" | "Planning";
  progress: number;
  description: string;
}

export default function NgoDashboard() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "proj-1", name: "Women in Agriculture Initiative", region: "Northern Zone", enrolled: 5200, status: "Active", progress: 75, description: "Empowering rural women smallholders with digital land certificates, premium seed allocations, and climate-smart financial tools." },
    { id: "proj-2", name: "Climate Resilience Fund", region: "Coastal Region", enrolled: 3100, status: "Active", progress: 40, description: "Focusing on community-led flood channels, high-salinity rice distribution, and parametric insurance enrollment." },
    { id: "proj-3", name: "Afforestation & Carbon Credit Link", region: "Eastern Highlands", enrolled: 1250, status: "Active", progress: 90, description: "Supporting smallholders to register agroforestry plots for verified carbon credits on national exchanges." },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const [newProj, setNewProj] = useState({
    name: "",
    region: "",
    enrolled: "",
    progress: 50,
    status: "Active" as Project["status"],
    description: ""
  });

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setAlertMsg("Impact Report exported successfully! Simulated CSV report downloaded in system cache.");
      setTimeout(() => setAlertMsg(null), 5000);
    }, 2000);
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.name || !newProj.region || !newProj.enrolled) {
      alert("Please fill in project name, region, and target enrolled farmers.");
      return;
    }

    const created: Project = {
      id: `proj-${Date.now()}`,
      name: newProj.name,
      region: newProj.region,
      enrolled: Number(newProj.enrolled),
      status: newProj.status,
      progress: Number(newProj.progress),
      description: newProj.description || "Multi-stakeholder agricultural extension initiative."
    };

    setProjects(prev => [...prev, created]);
    setShowAddModal(false);
    setNewProj({ name: "", region: "", enrolled: "", progress: 50, status: "Active", description: "" });
    setAlertMsg(`Project "${created.name}" created and launched successfully!`);
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Compute stats
  const totalEnrolled = projects.reduce((acc, p) => acc + p.enrolled, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500" id="ngo-dashboard-root">
      
      {/* Alert Banner */}
      {alertMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl flex items-center gap-2.5 shadow-3xs animate-bounce text-left">
          <CheckCircle className="text-emerald-700 shrink-0" size={18} />
          <span className="text-xs font-semibold">{alertMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">NGO & Partner Impact Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor decentralized grant progress, smallholder enrollment rates, and verified agronomic metrics.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Register Project
          </button>
          <button 
            onClick={handleExportReport}
            disabled={isExporting}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin text-gray-500" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} /> Export Impact Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="ngo-stats">
        <div className="bg-emerald-800 text-white p-6 rounded-3xl shadow-xs relative overflow-hidden text-left">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-700/20 rounded-full blur-xl pointer-events-none"></div>
          <Heart className="text-emerald-300 mb-4" size={28} />
          <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Active Smallholders Enrolled</p>
          <p className="text-4xl font-black mt-1">{(15000 + totalEnrolled).toLocaleString()}</p>
          <p className="text-xs text-emerald-300 mt-2 font-medium">✓ Spanning 6 distinct global regions</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-3xs text-left">
          <Award className="text-blue-500 mb-4" size={28} />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Micro-Grants Funded</p>
          <p className="text-4xl font-black text-gray-900 mt-1">$1.45M</p>
          <p className="text-xs text-blue-600 font-bold mt-2">100% On-Chain Transparent Ledger</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-3xs text-left">
          <Leaf className="text-amber-500 mb-4" size={28} />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Est. Carbon Sequestered</p>
          <p className="text-4xl font-black text-gray-900 mt-1">456,200</p>
          <p className="text-xs text-gray-500 mt-2 font-medium">Estimated metric tons of CO₂ equivalent</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6" id="ngo-table">
        <h3 className="text-base font-extrabold text-gray-900 mb-5 flex items-center gap-2 text-left">
          <Target className="text-indigo-500" /> Active Regional Initiatives ({projects.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-gray-400 uppercase bg-gray-50 font-black tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5">Project Name</th>
                <th className="px-5 py-3.5">Target Zone</th>
                <th className="px-5 py-3.5">Enrollment Count</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Progress Rate</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-xs text-gray-700">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4 font-extrabold text-gray-900">{proj.name}</td>
                  <td className="px-5 py-4 text-gray-500">{proj.region}</td>
                  <td className="px-5 py-4 text-gray-900 font-bold">{proj.enrolled.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      proj.status === "Active" ? "bg-emerald-100 text-emerald-800" :
                      proj.status === "Completed" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-500"
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5 shrink-0">
                        <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button 
                      onClick={() => setSelectedProject(proj)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer underline"
                    >
                      Inspect Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-150 overflow-hidden text-left animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-extrabold text-gray-900">Project Information Hub</h3>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-bold uppercase mb-1.5">
                  {selectedProject.region}
                </span>
                <h4 className="text-lg font-black text-gray-950 leading-snug">{selectedProject.name}</h4>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-gray-600 leading-relaxed font-semibold">
                {selectedProject.description}
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[9px] text-gray-400 font-bold uppercase block leading-none">Farmers Enrolled</span>
                  <span className="text-base font-black text-gray-900 mt-1 block">{selectedProject.enrolled.toLocaleString()}</span>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <span className="text-[9px] text-gray-400 font-bold uppercase block leading-none">Funding Phase</span>
                  <span className="text-base font-black text-emerald-800 mt-1 block">Active (Phase 2)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                  <span>Milestone Completion</span>
                  <span>{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedProject(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW PROJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-150 overflow-hidden text-left animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-sm font-extrabold text-gray-900">Register NGO Project</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Project Initiative Name</label>
                <input 
                  type="text" 
                  value={newProj.name}
                  onChange={(e) => setNewProj(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Sustainable Avocado Extension Program"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Target Zone</label>
                  <input 
                    type="text" 
                    value={newProj.region}
                    onChange={(e) => setNewProj(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g. Western Province"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Farmers Goal Count</label>
                  <input 
                    type="number" 
                    value={newProj.enrolled}
                    onChange={(e) => setNewProj(prev => ({ ...prev, enrolled: e.target.value }))}
                    placeholder="e.g. 1500"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Brief Description & Objective</label>
                <textarea 
                  value={newProj.description}
                  onChange={(e) => setNewProj(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe funding and agricultural support mechanisms..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Launch Project Initiative
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
