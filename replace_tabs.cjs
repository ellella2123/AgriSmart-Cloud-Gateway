const fs = require('fs');
const content = fs.readFileSync('src/components/FarmersDashboard.tsx', 'utf-8');

const updated = content
  .replace(/const \[activeTab, setActiveTab\] = useState<"assess" \| "weather" \| "prices" \| "diagnose" \| "list">.*?;/, 
    'const [activeTab, setActiveTab] = useState<"none" | "assess" | "weather" | "prices" | "diagnose" | "list">("none");')
  .replace(
    /\{\/\* Internal Navigation Tabs \*\/\}[\s\S]*?id="farmer-dash-tabs">[\s\S]*?<\/div>/,
    `{/* Feature Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 mb-8 w-full" id="farmer-dash-tabs">
        {[
          { id: "assess", icon: FileText, label: "Land & Climate Assessment", color: "bg-emerald-100 text-emerald-700" },
          { id: "weather", icon: CloudSun, label: "5-Day Agro-Weather", color: "bg-sky-100 text-sky-700" },
          { id: "prices", icon: TrendingUp, label: "Live Crop Prices", color: "bg-amber-100 text-amber-700" },
          { id: "diagnose", icon: UploadCloud, label: "Visual Diagnostics", color: "bg-purple-100 text-purple-700" },
          { id: "list", icon: Plus, label: "Smart Listing", color: "bg-rose-100 text-rose-700" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === "prices" && !priceData) {
                handleFetchCropPrice(cropName || "Maize", location || "Kano, Nigeria");
              }
            }}
            className="flex flex-col items-center justify-center p-4 sm:p-5 bg-white/70 backdrop-blur-xl border border-white/40 hover:bg-white hover:-translate-y-1 hover:shadow-lg transition-all rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer group text-center gap-3"
          >
             <div className={\`p-4 rounded-2xl \${tab.color} group-hover:scale-110 transition-transform\`}>
               <tab.icon size={28} strokeWidth={2.5} />
             </div>
             <span className="font-extrabold text-gray-800 text-[11px] sm:text-xs uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>`
  )
  .replace(
    /<AnimatePresence mode="wait">/,
    `<AnimatePresence mode="wait">
        {activeTab !== "none" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-full max-w-7xl h-[95vh] sm:h-auto sm:max-h-[95vh] bg-white/90 backdrop-blur-3xl rounded-3xl sm:rounded-[2rem] shadow-2xl flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200/50 bg-white/50 rounded-t-3xl sm:rounded-t-[2rem] shrink-0">
                <h3 className="font-black text-lg text-emerald-950 flex items-center gap-2">
                  <span className="text-emerald-700"><Sparkles size={20} /></span>
                  {activeTab === "assess" ? "Land & Climate Assessment" :
                   activeTab === "weather" ? "5-Day Agro-Weather" :
                   activeTab === "prices" ? "Live Crop Prices" :
                   activeTab === "diagnose" ? "Visual Diagnostics" :
                   activeTab === "list" ? "Smart Listing" : ""}
                </h3>
                <button onClick={() => setActiveTab("none")} className="p-2 bg-gray-200/50 hover:bg-gray-300/50 rounded-full cursor-pointer transition-colors shrink-0">
                  <X size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-4 sm:p-6 hide-scrollbar flex-1 relative">`
  )
  .replace(
    /\{\/\* --- TAB 3: SMART LISTING AND AI IMAGING --- \*\/\}[\s\S]*?<\/div>\s*<\/motion\.div>\s*\)\}\s*<\/AnimatePresence>/,
    match => match.replace(/<\/AnimatePresence>/, '</div></motion.div></div>)}</AnimatePresence>')
  );

fs.writeFileSync('src/components/FarmersDashboard.tsx', updated);
console.log('Tabs updated to Modals');
