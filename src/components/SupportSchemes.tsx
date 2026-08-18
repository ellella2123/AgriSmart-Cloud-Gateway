import { useState } from "react";
import { 
  Award, Landmark, CheckCircle, Loader2, Sparkles, 
  BookOpen, FileCheck, UserCheck, ShieldAlert, 
  Layers, HelpingHand, Landmark as BankIcon, Wheat, ClipboardCheck, ExternalLink
} from "lucide-react";

export default function SupportSchemes() {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "gmp-register" | "fertilizer-apply" | "aggregation-check">("overview");

  // State for GMP Registration
  const [gmpForm, setGmpForm] = useState({
    farmerName: "",
    cooperativeName: "",
    cropType: "Rice",
    expectedYield: "",
    location: "Kano State",
    siloPreference: "Kano Central Silo",
    phone: "",
    agricCertificateId: ""
  });
  const [gmpRegistered, setGmpRegistered] = useState(false);
  const [gmpRegId, setGmpRegId] = useState("");
  const [isRegisteringGmp, setIsRegisteringGmp] = useState(false);

  // State for Fertilizer Grant Application
  const [fertForm, setFertForm] = useState({
    farmerName: "",
    phone: "",
    state: "Enugu State",
    landSize: "",
    crop: "Maize",
    nationalId: ""
  });
  const [fertApplied, setFertApplied] = useState(false);
  const [fertRegId, setFertRegId] = useState("");
  const [isRegisteringFert, setIsRegisteringFert] = useState(false);

  // State for Aggregation Group Checker
  const [aggAnswers, setAggAnswers] = useState({
    registeredCAC: null as boolean | null,
    memberCount: "",
    bankAccount: null as boolean | null,
    warehouseCapacity: "",
    previousSupplies: null as boolean | null
  });
  const [aggResult, setAggResult] = useState<"eligible" | "pending" | "ineligible" | null>(null);

  // Silos array
  const silos = [
    "Kano Central Silo (Capacity: 100,000 MT)",
    "Ogbomosho Grain Silo (Capacity: 25,000 MT)",
    "Ibadan National Silo (Capacity: 50,000 MT)",
    "Gombe Regional Silo (Capacity: 25,000 MT)",
    "Anambra Food Silo (Capacity: 25,000 MT)",
    "FCT National Silo (Capacity: 100,000 MT)"
  ];

  // Price floors under food stabilisation plan (Guaranteed Minimum Price - GMP)
  const priceFloors: Record<string, string> = {
    Rice: "₦450,000 / Metric Ton",
    Maize: "₦380,000 / Metric Ton",
    Soybeans: "₦520,000 / Metric Ton",
    Cassava: "₦180,000 / Metric Ton"
  };

  const handleGmpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisteringGmp(true);
    setTimeout(() => {
      setIsRegisteringGmp(false);
      setGmpRegId(`GMP-BOA-${Math.floor(100000 + Math.random() * 900000)}`);
      setGmpRegistered(true);
    }, 1500);
  };

  const handleFertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisteringFert(true);
    setTimeout(() => {
      setIsRegisteringFert(false);
      setFertRegId(`FISP-NADF-${Math.floor(100000 + Math.random() * 900000)}`);
      setFertApplied(true);
    }, 1500);
  };

  const evaluateAggregation = () => {
    const { registeredCAC, memberCount, bankAccount, warehouseCapacity, previousSupplies } = aggAnswers;
    const members = parseInt(memberCount) || 0;
    const capacity = parseFloat(warehouseCapacity) || 0;

    if (registeredCAC === true && members >= 20 && bankAccount === true && capacity >= 10 && previousSupplies === true) {
      setAggResult("eligible");
    } else if (registeredCAC === true && members >= 10 && bankAccount === true) {
      setAggResult("pending");
    } else {
      setAggResult("ineligible");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500" id="support-schemes-root">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-6">
          <Landmark size={400} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-xs font-bold tracking-wider text-emerald-200 uppercase">
            <Sparkles size={13} className="animate-pulse" />
            Federal Government Food Security Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
            Renewed Hope Farm Input & BOA Stabilisation Plan
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl font-medium leading-relaxed">
            Eliminating post-harvest losses, direct input subsidies, crop registration for Guaranteed Minimum Price (GMP) silo offtakes, and nationwide fertilizer allocations.
          </p>
        </div>
      </div>

      {/* Sub tabs inside support portal */}
      <div className="flex border-b border-gray-250 overflow-x-auto hide-scrollbar bg-white p-1.5 rounded-2xl shadow-xs gap-1">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === "overview" 
              ? "bg-emerald-700 text-white shadow-xs" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          <BookOpen size={15} /> Schemes Overview & News
        </button>
        <button
          onClick={() => setActiveSubTab("gmp-register")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === "gmp-register" 
              ? "bg-emerald-700 text-white shadow-xs" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          <Wheat size={15} /> Register Crop for GMP
        </button>
        <button
          onClick={() => setActiveSubTab("fertilizer-apply")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === "fertilizer-apply" 
              ? "bg-emerald-700 text-white shadow-xs" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          <HelpingHand size={15} /> Free Fertilizer Allocation
        </button>
        <button
          onClick={() => setActiveSubTab("aggregation-check")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === "aggregation-check" 
              ? "bg-emerald-700 text-white shadow-xs" 
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          <UserCheck size={15} /> Aggregation Requirements Check
        </button>
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. OVERVIEW & NEWS */}
      {activeSubTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Key Implementing Entities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* FMAFS */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-2xs hover:border-emerald-300 transition-all space-y-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-800 w-fit">
                <Landmark size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-gray-900">FMAFS</h3>
                <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider leading-none">Federal Ministry of Agriculture & Food Security</p>
                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  Partnered directly with the National Agricultural Development Fund (NADF) and agricultural groups like the All Farmers Association of Nigeria (AFAN) to directly distribute massive input support to smallholders.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 pt-2 border-t border-gray-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-extrabold">✓</span> Distributed 80,640 fertilizer bags to North-Central, South-West and South-East.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-extrabold">✓</span> Over 20,160 verified smallholder beneficiaries in primary rollouts.
                </li>
              </ul>
            </div>

            {/* BOA */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-2xs hover:border-emerald-300 transition-all space-y-4">
              <div className="bg-teal-50 p-3 rounded-xl text-teal-800 w-fit">
                <BankIcon size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-gray-900">Bank of Agriculture</h3>
                <p className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider leading-none">BOA Price Stabilisation Agency</p>
                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  Driving the presidential mandate to buy up excess staple crops directly from local farmers at a fixed Guaranteed Minimum Price (GMP) floor. Safeguards family income and feeds national silo networks.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 pt-2 border-t border-gray-100">
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-extrabold">✓</span> Direct grain offtake systems for maize, soybeans, wheat, and rice.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-extrabold">✓</span> Eradicates middleman volatility and post-harvest market drops.
                </li>
              </ul>
            </div>

            {/* NADF */}
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-2xs hover:border-emerald-300 transition-all space-y-4">
              <div className="bg-emerald-50 p-3 rounded-xl text-emerald-800 w-fit">
                <Award size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-gray-900">NADF</h3>
                <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider leading-none">National Agricultural Development Fund</p>
                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  Responsible for the execution and verification of the Fertiliser Distribution Program. Directly finances production inputs and subsidizes genuine smallholder crop developers.
                </p>
              </div>
              <ul className="text-xs text-gray-600 space-y-2 pt-2 border-t border-gray-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-extrabold">✓</span> Administers the FISP Farm Input Support certificates.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-extrabold">✓</span> Verifies genuine farm sizes to prevent non-farmer exploitation.
                </li>
              </ul>
            </div>

          </div>

          {/* Quick Access Guide Banner */}
          <div className="bg-emerald-50 border border-emerald-150 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles size={15} className="text-emerald-700" />
                Want to sell crop produce to the Bank of Agriculture?
              </h3>
              <p className="text-xs text-emerald-800 max-w-xl leading-relaxed">
                We can guide you through registering your crops for the Guaranteed Minimum Price (GMP) program, storing in national silos, or qualifying as a Farmer Aggregation group.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setActiveSubTab("gmp-register")}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                Register Crop Now
              </button>
              <button
                onClick={() => setActiveSubTab("aggregation-check")}
                className="bg-white hover:bg-emerald-100/50 text-emerald-900 border border-emerald-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                Aggregation Requirements
              </button>
            </div>
          </div>

          {/* News and Updates Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="text-emerald-800" size={18} />
              Recent Support Scheme Milestones & Program News
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Press Release • FMAFS</span>
                  <span>July 2026</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                  FG Launches South-East Farm Input Support Programme
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Minister of Agriculture and Food Security Senator Abubakar Kyari officially flagged off input supply networks, distributing 80,640 free fertilizer bags to boost domestic food production across the region.
                </p>
                <a 
                  href="https://agriculture.gov.ng/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  <span>Read FMAFS distribution guidelines</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Market Security • BOA</span>
                  <span>May 2026</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                  BOA Unveils Food Price Stabilisation & Of-take Plan
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  To shield farmers from volatile crop drops, BOA announced robust direct offtake operations under a Guaranteed Minimum Price (GMP) framework, purchasing excess staples immediately at harvest to deposit into national silos.
                </p>
                <a 
                  href="https://www.boanig.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  <span>View set minimum price floors</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Presidential Directive • FMAFS</span>
                  <span>June 2026</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                  President Tinubu Directs Supply of 2.1 Million Fertilizer Bags
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  A nationwide agricultural stimulus targeting genuine smallholder farmers. The NADF and FISP will manage on-chain database verifications to ensure direct farm delivery.
                </p>
                <a 
                  href="https://nadf.gov.ng/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  <span>Check local distribution center locations</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-150 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                  <span>Cooperative Grants • NADF</span>
                  <span>June 2026</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                  FISP Fertilizer Distribution Registration Portal Activated
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Cooperative groups and individual small-scale growers are encouraged to upload crop lists and size data. Verified land assessments instantly unlock input pickup vouchers.
                </p>
                <a 
                  href="https://agriculture.gov.ng/projects/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  <span>Register on FISP portal</span>
                  <ExternalLink size={10} />
                </a>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 2. REGISTER FOR GMP */}
      {activeSubTab === "gmp-register" && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden animate-in fade-in duration-300">
          
          <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-850">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Wheat className="text-amber-500" size={20} />
                Bank of Agriculture GMP Registration Portal
              </h3>
              <p className="text-xs text-slate-300">
                Lock in your Guaranteed Minimum Price (GMP) to eliminate market risks and prepare silo offloading schedules.
              </p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
              ⚡ Safe Offtake Program
            </div>
          </div>

          <div className="p-6">
            {!gmpRegistered ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Information panel */}
                <div className="lg:col-span-4 space-y-5 bg-slate-50/50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Set price floors (Current season)</h4>
                  
                  <div className="space-y-2.5">
                    {Object.entries(priceFloors).map(([crop, price]) => (
                      <div key={crop} className="flex justify-between items-center text-xs border-b border-gray-150 pb-2">
                        <span className="font-bold text-slate-800">{crop}</span>
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">{price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-150 text-xs text-slate-600">
                    <h5 className="font-bold text-slate-800 flex items-center gap-1">
                      <ShieldAlert size={14} className="text-amber-600" />
                      Important Guidelines
                    </h5>
                    <p className="leading-relaxed">
                      1. Registrations require an active land parcel or **Weather Suitability Certificate**.
                    </p>
                    <p className="leading-relaxed">
                      2. Upon registration, you will receive a silo allocation dispatch. Keep your dispatch ID secure for physical crop transport.
                    </p>
                  </div>
                </div>

                {/* Form column */}
                <form onSubmit={handleGmpSubmit} className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Farmer / Registrar Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={gmpForm.farmerName} 
                        onChange={(e) => setGmpForm({...gmpForm, farmerName: e.target.value})} 
                        placeholder="Musa Ibrahim" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Farmer Association / Cooperative (Optional)</label>
                      <input 
                        type="text" 
                        value={gmpForm.cooperativeName} 
                        onChange={(e) => setGmpForm({...gmpForm, cooperativeName: e.target.value})} 
                        placeholder="AFAN Kano Chapter Co-op" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Crop Commodity for Offtake *</label>
                      <select 
                        value={gmpForm.cropType} 
                        onChange={(e) => setGmpForm({...gmpForm, cropType: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      >
                        <option value="Rice">Rice (Premium Staple)</option>
                        <option value="Maize">Maize (White/Yellow)</option>
                        <option value="Soybeans">Soybeans</option>
                        <option value="Cassava">Cassava (Tubers)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Estimated Harvest Quantity (Metric Tons) *</label>
                      <input 
                        type="number" 
                        required 
                        value={gmpForm.expectedYield} 
                        onChange={(e) => setGmpForm({...gmpForm, expectedYield: e.target.value})} 
                        placeholder="e.g. 5" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Farming Location (State) *</label>
                      <input 
                        type="text" 
                        required 
                        value={gmpForm.location} 
                        onChange={(e) => setGmpForm({...gmpForm, location: e.target.value})} 
                        placeholder="Kano State" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Preferred Government Silo Center *</label>
                      <select 
                        value={gmpForm.siloPreference} 
                        onChange={(e) => setGmpForm({...gmpForm, siloPreference: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      >
                        {silos.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Contact Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={gmpForm.phone} 
                        onChange={(e) => setGmpForm({...gmpForm, phone: e.target.value})} 
                        placeholder="e.g. 08012345678" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Weather/Soil Certificate ID (Optional)</label>
                      <input 
                        type="text" 
                        value={gmpForm.agricCertificateId} 
                        onChange={(e) => setGmpForm({...gmpForm, agricCertificateId: e.target.value})} 
                        placeholder="e.g. CERT-8201" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegisteringGmp}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-950 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isRegisteringGmp ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-emerald-300" />
                        Generating Offtake Contract & Silo Pass...
                      </>
                    ) : (
                      <>
                        <FileCheck size={14} /> Commit GMP Crop Registration Contract
                      </>
                    )}
                  </button>
                </form>

              </div>
            ) : (
              <div className="p-6 text-center max-w-xl mx-auto space-y-5 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mx-auto border border-emerald-200">
                  <CheckCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-gray-900">GMP Offtake Contract Registered!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your registration has been logged by the Bank of Agriculture Food Price Stabilisation Unit. The guaranteed price floor has been cryptographically locked.
                  </p>
                </div>

                <div className="bg-slate-50 border border-gray-200 p-5 rounded-2xl text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-gray-200 pb-2.5">
                    <span className="text-gray-400">CONTRACT REFERENCE ID:</span>
                    <span className="font-extrabold text-slate-800">{gmpRegId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">REGISTRAR:</span>
                    <span className="font-extrabold text-slate-800">{gmpForm.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">COMMODITY BASE:</span>
                    <span className="font-extrabold text-slate-800">{gmpForm.cropType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">QUANTITY:</span>
                    <span className="font-extrabold text-slate-800">{gmpForm.expectedYield} Metric Tons</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2.5 font-bold text-emerald-800 text-sm">
                    <span>PRICE PER MT:</span>
                    <span>{priceFloors[gmpForm.cropType]}</span>
                  </div>
                  <div className="bg-slate-950 text-white p-3.5 rounded-xl mt-3 text-[10px] space-y-1.5">
                    <div className="font-bold text-amber-400 flex items-center gap-1">
                      <Landmark size={12} />
                      Silo Allocation & Transport Pass
                    </div>
                    <p className="text-slate-300 leading-normal">
                      Allocated Center: **{gmpForm.siloPreference}**. Show this reference ID at dispatch arrival to instantly skip validation processing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => {
                      setGmpRegistered(false);
                      setGmpForm({
                        farmerName: "",
                        cooperativeName: "",
                        cropType: "Rice",
                        expectedYield: "",
                        location: "Kano State",
                        siloPreference: "Kano Central Silo",
                        phone: "",
                        agricCertificateId: ""
                      });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Register Another Crop
                  </button>
                  <button
                    onClick={() => setActiveSubTab("overview")}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-950 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Back to Schemes Overview
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. FREE FERTILIZER ALLOCATION */}
      {activeSubTab === "fertilizer-apply" && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden animate-in fade-in duration-300">
          
          <div className="bg-emerald-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-950">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <HelpingHand className="text-emerald-300" size={20} />
                Renewed Hope Farm Input Distribution Portal
              </h3>
              <p className="text-xs text-emerald-200">
                In line with President Bola Ahmed Tinubu's directive: Distributing free fertilizer bags and seed grants to qualified smallholder farmers.
              </p>
            </div>
            <div className="bg-emerald-950/50 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
              ✓ Free Allocation Program
            </div>
          </div>

          <div className="p-6">
            {!fertApplied ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Information panel */}
                <div className="lg:col-span-4 space-y-5 bg-slate-50/50 p-5 rounded-2xl border border-gray-100 text-xs text-slate-700">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">NADF FISP Statistics</h4>
                  
                  <div className="space-y-3">
                    <p className="leading-relaxed">
                      - **Total Allocation**: 2.1 Million Fertilizer Bags.
                    </p>
                    <p className="leading-relaxed">
                      - **Recent Geopolitical Distributions**: 80,640 Bags dispatched to North-Central (10 June 2026), South-East (6 July 2026), and South-West (7 July 2026).
                    </p>
                    <p className="leading-relaxed">
                      - **Grant Content**: Every approved grower receives **4 free bags of high-grade NPK Fertilizer** plus a seed kit based on their primary crop type.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl space-y-2 font-semibold">
                    <h5 className="flex items-center gap-1 text-xs">
                      <ShieldAlert size={14} className="text-amber-700" />
                      Verification Disclaimer
                    </h5>
                    <p className="leading-normal text-[11px] font-medium text-amber-800">
                      The FISP is strictly for genuine small-scale growers. Multi-land registrations will trigger audit alerts to guarantee direct farm delivery.
                    </p>
                  </div>
                </div>

                {/* Form column */}
                <form onSubmit={handleFertSubmit} className="lg:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Farmer Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={fertForm.farmerName} 
                        onChange={(e) => setFertForm({...fertForm, farmerName: e.target.value})} 
                        placeholder="Florence Ade" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">National Identity Number (NIN) / Farmer ID *</label>
                      <input 
                        type="text" 
                        required 
                        value={fertForm.nationalId} 
                        onChange={(e) => setFertForm({...fertForm, nationalId: e.target.value})} 
                        placeholder="NIN-102938475" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">State of Residence *</label>
                      <select 
                        value={fertForm.state} 
                        onChange={(e) => setFertForm({...fertForm, state: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      >
                        <option value="Enugu State">Enugu State (South-East)</option>
                        <option value="Oyo State">Oyo State (South-West)</option>
                        <option value="Niger State">Niger State (North-Central)</option>
                        <option value="Kano State">Kano State (North-West)</option>
                        <option value="Delta State">Delta State (South-South)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Cultivated Land Size (Acres) *</label>
                      <input 
                        type="number" 
                        required 
                        value={fertForm.landSize} 
                        onChange={(e) => setFertForm({...fertForm, landSize: e.target.value})} 
                        placeholder="e.g. 2" 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block">Target Staple Crop *</label>
                      <select 
                        value={fertForm.crop} 
                        onChange={(e) => setFertForm({...fertForm, crop: e.target.value})} 
                        className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                      >
                        <option value="Maize">Maize</option>
                        <option value="Rice">Rice</option>
                        <option value="Cassava">Cassava</option>
                        <option value="Sorghum">Sorghum</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">Contact Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      value={fertForm.phone} 
                      onChange={(e) => setFertForm({...fertForm, phone: e.target.value})} 
                      placeholder="e.g. 08123456789" 
                      className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRegisteringFert}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isRegisteringFert ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-emerald-300" />
                        Verifying NIN & Allocating Free Input Grant...
                      </>
                    ) : (
                      <>
                        <HelpingHand size={14} /> Claim My Free Fertilizer & Seeds Grant
                      </>
                    )}
                  </button>
                </form>

              </div>
            ) : (
              <div className="p-6 text-center max-w-xl mx-auto space-y-5 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 mx-auto border border-emerald-200">
                  <CheckCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-gray-900">Input Support Voucher Issued!</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Congratulations! Your details have been checked against the NADF database. A pickup code has been generated.
                  </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200 p-5 rounded-2xl text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-emerald-200 pb-2.5">
                    <span className="text-emerald-800/60">VOUCHER SECURE ID:</span>
                    <span className="font-extrabold text-emerald-950">{fertRegId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800/60">BENEFICIARY:</span>
                    <span className="font-extrabold text-emerald-950">{fertForm.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800/60">NIN REGISTRATION:</span>
                    <span className="font-extrabold text-emerald-950">{fertForm.nationalId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800/60">GRANTED SUBSTANCE:</span>
                    <span className="font-extrabold text-emerald-950">4 Bags NPK 20-10-10 & {fertForm.crop} Seeds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800/60">DISTRIBUTION STATE:</span>
                    <span className="font-extrabold text-emerald-950">{fertForm.state}</span>
                  </div>
                  <div className="bg-emerald-900 text-white p-3.5 rounded-xl mt-3 text-[10px] space-y-1.5 leading-normal">
                    <div className="font-bold text-emerald-300 flex items-center gap-1">
                      <Wheat size={12} />
                      Pickup Instructions
                    </div>
                    <p className="text-emerald-100">
                      Take this secure ID (**{fertRegId}**) to your closest FMAFS regional warehouse center in **{fertForm.state}** to instantly redeem your free inputs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => {
                      setFertApplied(false);
                      setFertForm({
                        farmerName: "",
                        phone: "",
                        state: "Enugu State",
                        landSize: "",
                        crop: "Maize",
                        nationalId: ""
                      });
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Apply New Voucher
                  </button>
                  <button
                    onClick={() => setActiveSubTab("overview")}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-950 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Back to Schemes Overview
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. AGGREGATION REQUIREMENTS CHECK */}
      {activeSubTab === "aggregation-check" && (
        <div className="bg-white rounded-2xl border border-gray-150 shadow-xs overflow-hidden animate-in fade-in duration-300">
          
          <div className="bg-teal-900 text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-950">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="text-teal-300" size={20} />
                Farmer Aggregation & Cooperative Eligibility Audit
              </h3>
              <p className="text-xs text-teal-200">
                Self-evaluate if your cooperative group meets the Bank of Agriculture and NADF official aggregator requirements to participate in crop offtakes.
              </p>
            </div>
            <div className="bg-teal-950/50 border border-teal-500/20 text-teal-300 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
              ✓ Self-Audit Tool
            </div>
          </div>

          <div className="p-6 space-y-6">
            
            <div className="bg-teal-50/40 p-4 rounded-xl border border-teal-100 text-xs text-teal-950 leading-relaxed space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-teal-900">
                <ClipboardCheck size={14} />
                Why qualify as a Cooperative Aggregator?
              </h4>
              <p>
                The Bank of Agriculture handles large-scale purchases via **Farmer Aggregation Groups** to streamline logistics. Registered cooperatives gain bulk shipping codes, priority silo dispatch slots, and guaranteed pricing contracts for their entire community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cooperative Assessment Checklist</h4>
                
                {/* Q1 */}
                <div className="space-y-2 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-bold text-gray-800">1. Is your group registered with the CAC (Corporate Affairs Commission)?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAggAnswers({...aggAnswers, registeredCAC: true})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        aggAnswers.registeredCAC === true 
                          ? "bg-teal-700 border-teal-800 text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Yes, Registered
                    </button>
                    <button
                      type="button"
                      onClick={() => setAggAnswers({...aggAnswers, registeredCAC: false})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        aggAnswers.registeredCAC === false 
                          ? "bg-rose-700 border-rose-800 text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      No, Informal Group
                    </button>
                  </div>
                </div>

                {/* Q2 */}
                <div className="space-y-2 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-bold text-gray-800">2. Active member count (registered smallholder farms)?</p>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={aggAnswers.memberCount}
                    onChange={(e) => setAggAnswers({...aggAnswers, memberCount: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                  />
                </div>

                {/* Q3 */}
                <div className="space-y-2 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-bold text-gray-800">3. Does your cooperative hold a dedicated commercial bank account?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAggAnswers({...aggAnswers, bankAccount: true})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        aggAnswers.bankAccount === true 
                          ? "bg-teal-700 border-teal-800 text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Yes, Corporate Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAggAnswers({...aggAnswers, bankAccount: false})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        aggAnswers.bankAccount === false 
                          ? "bg-rose-700 border-rose-800 text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      No / Individual Account
                    </button>
                  </div>
                </div>

                {/* Q4 */}
                <div className="space-y-2 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-bold text-gray-800">4. Aggregated warehouse storage capacity (Metric Tons)?</p>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={aggAnswers.warehouseCapacity}
                    onChange={(e) => setAggAnswers({...aggAnswers, warehouseCapacity: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                  />
                </div>

                {/* Q5 */}
                <div className="space-y-2 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                  <p className="text-xs font-bold text-gray-800">5. Have you previously supplied grains to state or federal grain reserves?</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAggAnswers({...aggAnswers, previousSupplies: true})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        aggAnswers.previousSupplies === true 
                          ? "bg-teal-700 border-teal-800 text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Yes, Experienced
                    </button>
                    <button
                      type="button"
                      onClick={() => setAggAnswers({...aggAnswers, previousSupplies: false})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                        aggAnswers.previousSupplies === false 
                          ? "bg-rose-700 border-rose-800 text-white" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      No / New Group
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={evaluateAggregation}
                  className="w-full py-2.5 bg-teal-850 hover:bg-teal-950 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Evaluate Eligibility Index
                </button>
              </div>

              {/* Assessment result output */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-gray-150 flex flex-col justify-center min-h-[250px]">
                
                {aggResult === null && (
                  <div className="text-center text-xs text-gray-400 space-y-2">
                    <ClipboardCheck size={36} className="mx-auto text-gray-300" />
                    <span>Complete the questions on the left and click "Evaluate Eligibility Index" to pull results.</span>
                  </div>
                )}

                {aggResult === "eligible" && (
                  <div className="space-y-4 text-left animate-in zoom-in duration-300">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase border border-emerald-200/50">
                      ✓ PRE-QUALIFIED AGGREGATOR
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">Excellent! Your Group Meets All Primary Criteria</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Your Corporate Affairs registration, robust warehouse capacity (above 10 MT), commercial banking setup, and active member registry (over 20 farmers) meet the **Bank of Agriculture (BOA)** and **NADF** guidelines to register as an Approved Food Security Aggregator.
                    </p>
                    <div className="bg-emerald-950 text-white p-4 rounded-xl text-xs space-y-1 font-mono">
                      <span className="font-bold text-emerald-300 uppercase">Next Offtake Step:</span>
                      <p className="text-slate-200 font-medium">
                        File a direct aggregation contract with the regional FMAFS officer. Please bring CAC certificate proof and your group bank details.
                      </p>
                    </div>
                  </div>
                )}

                {aggResult === "pending" && (
                  <div className="space-y-4 text-left animate-in zoom-in duration-300">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase border border-amber-200/50">
                      ⚠ SEMI-QUALIFIED (INFORMATIONAL GAP)
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">Group Qualifies with Moderate Conditions</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      You meet the essential CAC and corporate bank requirements, but your warehouse capacity or previous supply experience requires a physical evaluation. 
                    </p>
                    <div className="bg-amber-950 text-white p-4 rounded-xl text-xs space-y-1 font-mono">
                      <span className="font-bold text-amber-300 uppercase">Action Plan:</span>
                      <p className="text-slate-200 font-medium">
                        NADF officers will contact you to perform a simple local soil and warehouse space audit. Your registration is marked as "Awaiting On-Site Review".
                      </p>
                    </div>
                  </div>
                )}

                {aggResult === "ineligible" && (
                  <div className="space-y-4 text-left animate-in zoom-in duration-300">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] uppercase border border-rose-200/50">
                      ✗ ACTION REQUIRED
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">Currently Below Offtake Thresholds</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      The Bank of Agriculture requires registered aggregation groups to hold active CAC registrations and commercial bank records to prevent loan diversion and secure direct payment delivery.
                    </p>
                    <div className="bg-rose-950 text-white p-4 rounded-xl text-xs space-y-1 font-mono">
                      <span className="font-bold text-rose-300 uppercase">Recommended Path:</span>
                      <p className="text-slate-200 font-medium">
                        1. Register your cooperative formal status via CAC.<br />
                        2. Establish an AFAN-backed joint group account.<br />
                        3. You can still register individual harvests via the **Register Crop for GMP** tab!
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
