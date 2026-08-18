import React, { useState, useEffect } from "react";
import { 
  Search, XCircle, BarChart3, 
  MapPin, Loader2, FileSpreadsheet, ShieldCheck, Globe, ExternalLink, Building2
} from "lucide-react";
import { Certificate } from "../types";
import AgriculturalMap from "./AgriculturalMap";

interface GovernmentPortalProps {
  certificates: Certificate[];
}

interface StatsData {
  totalCertificates: number;
  approvedLoans: number;
  averageSuitabilityScore: number;
  regionalBreakdown: Array<{
    region: string;
    certificatesCount: number;
    averageScore: number;
    fertilityRate: number;
  }>;
}

export default function GovernmentPortal({ certificates }: GovernmentPortalProps) {
  // Verification search state
  const [searchId, setSearchId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Administrative actions state
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [approvedLoansState, setApprovedLoansState] = useState<string[]>([]);
  const [showGovernmentMap, setShowGovernmentMap] = useState(true);

  // Analytics Stats state
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Fetch government statistics
  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch("/api/government/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load statistics", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [certificates]);

  // Handle certificate verification query
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsVerifying(true);
    setVerifiedCert(null);
    setVerifyError(null);

    try {
      const response = await fetch(`/api/certificates/${searchId.trim()}`);
      if (!response.ok) {
        throw new Error("No certificate matches this ID or verification hash.");
      }
      const data = await response.json();
      setVerifiedCert(data);
    } catch (err: any) {
      setVerifyError(err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  // Toggle administrative support
  const toggleEndorsement = (certId: string) => {
    if (approvedLoansState.includes(certId)) {
      setApprovedLoansState(prev => prev.filter(id => id !== certId));
    } else {
      setApprovedLoansState(prev => [...prev, certId]);
    }
  };

  const toggleFlag = (certId: string) => {
    if (flaggedIds.includes(certId)) {
      setFlaggedIds(prev => prev.filter(id => id !== certId));
    } else {
      setFlaggedIds(prev => [...prev, certId]);
    }
  };

  return (
    <div className="font-sans space-y-8" id="government-portal-root">
      {/* Upper Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-800 text-xs font-semibold tracking-wider text-slate-300 uppercase inline-block mb-3.5">
            GOVERNMENT & BANK CREDIT PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Agricultural Suitability Registry & Verification Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-200/80 leading-relaxed mt-2">
            Verify farming credit qualifications, evaluate regional climate suitability indicators, and audit verified micro-loans with cryptographic blockchain verification seals.
          </p>
        </div>
      </div>

      {/* Verification & Search Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cert Search verifier */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-slate-700 animate-pulse" size={18} />
              Verify Certificate Authenticity
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Input the unique Certificate ID (e.g. CERT-9081) or security hash below to pull the official grounding log from database.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. CERT-9081 or agri-verify-*"
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:border-slate-500 outline-none transition-all placeholder:text-gray-400 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying || !searchId.trim()}
              className={`w-full py-2.5 bg-slate-800 hover:bg-slate-950 text-white rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isVerifying ? "bg-slate-800/50 cursor-not-allowed" : ""
              }`}
              id="btn-trigger-verify"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={13} className="animate-spin text-slate-300" />
                  Verifying Cryptographic Seal...
                </>
              ) : (
                "Verify Certificate"
              )}
            </button>
          </form>

          {/* Verification Result Display */}
          <div className="pt-2">
            {verifiedCert ? (
              <div className="bg-emerald-50/40 border border-emerald-150 p-4 rounded-2xl space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold tracking-wider">
                    ✓ VERIFIED SECURE
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono font-bold">{verifiedCert.id}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase leading-none">Farmer & Land Details</span>
                  <h4 className="text-xs font-bold text-gray-800">{verifiedCert.farmerName}</h4>
                  <p className="text-[11px] text-gray-600">Location: {verifiedCert.location} • Crop: {verifiedCert.cropName}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-emerald-100/30 text-xs">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Ferdility Status</span>
                    <span className="font-bold text-gray-700">{verifiedCert.fertilityStatus}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">Weather Suitability</span>
                    <span className="font-bold text-emerald-800">{verifiedCert.weatherSuitabilityScore}% Score</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 leading-relaxed italic border-t border-emerald-100/30 pt-2.5">
                  " {verifiedCert.notes} "
                </p>

                <div className="text-[9px] font-mono text-emerald-700 flex justify-between">
                  <span>LOAN SUPPORT:</span>
                  <span className="font-bold uppercase">{verifiedCert.loanEligibility ? "ELIGIBLE" : "INELIGIBLE"}</span>
                </div>
              </div>
            ) : verifyError ? (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">Verification Failed</h5>
                  <p className="text-[11px] text-rose-600/80 mt-0.5">{verifyError}</p>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-gray-200 p-6 rounded-2xl text-center text-xs text-gray-400 flex flex-col items-center justify-center min-h-[120px]">
                <FileSpreadsheet size={28} className="text-gray-300 mb-2" />
                <span>Await security queries...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Statistics & Regional Analysis */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="text-slate-700" size={18} />
                Global Heatmaps & Micro-Credit Indicators
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Regional suitability scores and farmer credit volumes logged live across the world.
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              {isLoadingStats ? "Reloading..." : "Refresh data"}
            </button>
          </div>

          {stats ? (
            <div className="space-y-6">
              {/* Stat summary cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-2xl">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Total Issued</span>
                  <span className="text-xl font-extrabold text-slate-800 block mt-1">{stats.totalCertificates}</span>
                  <span className="text-[9px] text-gray-400 block uppercase">Certificates</span>
                </div>
                <div className="bg-emerald-50/40 border border-emerald-100/30 p-3 rounded-2xl">
                  <span className="text-[9px] text-emerald-800/60 font-bold uppercase block leading-none">Approved Loans</span>
                  <span className="text-xl font-extrabold text-emerald-800 block mt-1">{stats.approvedLoans}</span>
                  <span className="text-[9px] text-gray-400 block uppercase">Endorsements</span>
                </div>
                <div className="bg-sky-50 border border-sky-100/50 p-3 rounded-2xl">
                  <span className="text-[9px] text-sky-800/60 font-bold uppercase block leading-none">Global Suitability</span>
                  <span className="text-xl font-extrabold text-sky-800 block mt-1">{stats.averageSuitabilityScore}%</span>
                  <span className="text-[9px] text-gray-400 block uppercase">Mean Index</span>
                </div>
              </div>

              {/* Regional breakdown chart using custom responsive SVGs */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regional Suitability Indices</h4>
                <div className="space-y-3 bg-slate-50/40 p-4 rounded-2xl border border-gray-100/40">
                  {stats.regionalBreakdown.map((reg, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" /> {reg.region}
                        </span>
                        <span className="text-slate-500">
                          {reg.certificatesCount} certs • avg {reg.averageScore}% index
                        </span>
                      </div>
                      
                      {/* Custom SVG Bar Chart indicator */}
                      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden relative">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${reg.averageScore}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-400 font-semibold font-mono">
                        <span>FERTILITY INDEX RATE: {reg.fertilityRate}%</span>
                        <span>CLIMATE INDEX COHESION</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              Loading financial and regional analytics...
            </div>
          )}
        </div>
      </div>

      {/* Global Ledger of Issued Certificates */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5" id="ledger-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="text-slate-700" size={18} />
              Global Certificate Ledger
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Global log of climate checks and micro-loan scores. Toggle financial support or auditing flags directly in the UI.
            </p>
          </div>
          
          <button
            onClick={() => setShowGovernmentMap(!showGovernmentMap)}
            type="button"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer self-start sm:self-auto ${
              showGovernmentMap
                ? "bg-slate-50 border-slate-200 text-slate-800"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {showGovernmentMap ? "🗺️ Hide Registry Map" : "🗺️ Show Registry Map"}
          </button>
        </div>

        {/* GOVERNMENT GEOGRAPHIC REGISTRY MAP */}
        {showGovernmentMap && certificates.some(c => c.latitude && c.longitude) && (
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-gray-100/60 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                <Globe className="text-slate-500 animate-spin" style={{ animationDuration: '15s' }} size={14} />
                Live Certified Land Map Registry
              </h3>
              <span className="text-[9px] text-gray-400 font-bold uppercase">
                {certificates.filter(c => c.latitude && c.longitude).length} Certified Locations Logged
              </span>
            </div>
            <AgriculturalMap
              mode="display-multi"
              items={certificates.map((cert) => ({
                id: cert.id,
                title: cert.cropName,
                subtitle: `${cert.farmerName} • ${cert.location}`,
                description: cert.notes,
                latitude: cert.latitude,
                longitude: cert.longitude,
                badge: `Score: ${cert.weatherSuitabilityScore}%`,
                badgeColor: "gold",
                score: cert.weatherSuitabilityScore,
                farmerName: cert.farmerName,
                buttonText: "🔍 Populate Verify Input",
                onClickButton: () => {
                  setSearchId(cert.id);
                  // Focus search input
                  const input = document.querySelector('input[placeholder*="CERT-"]') as HTMLInputElement;
                  if (input) {
                    input.value = cert.id;
                    input.focus();
                  }
                }
              }))}
              height="300px"
            />
          </div>
        )}

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs text-gray-600 border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Cert ID</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Region / Location</th>
                <th className="py-3 px-4">Crop Type</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Loan Eligibility</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {certificates.map((cert) => {
                const isFlagged = flaggedIds.includes(cert.id);
                const isEndorsedByBank = approvedLoansState.includes(cert.id) || cert.loanEligibility;

                return (
                  <tr 
                    key={cert.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${
                      isFlagged ? "bg-rose-50/20" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{cert.id}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">{cert.farmerName}</td>
                    <td className="py-3.5 px-4 truncate max-w-40">{cert.location}</td>
                    <td className="py-3.5 px-4 font-medium">{cert.cropName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{cert.weatherSuitabilityScore}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                        isEndorsedByBank
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200/20"
                          : "bg-amber-100 text-amber-800 border border-amber-200/20"
                      }`}>
                        {isEndorsedByBank ? "Credit Eligible" : "Awaiting Actions"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => toggleEndorsement(cert.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                          approvedLoansState.includes(cert.id)
                            ? "bg-emerald-700 text-white hover:bg-emerald-800"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {approvedLoansState.includes(cert.id) ? "✓ Endorsed" : "Endorse Loan"}
                      </button>
                      <button
                        onClick={() => toggleFlag(cert.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                          isFlagged
                            ? "bg-rose-600 text-white hover:bg-rose-700"
                            : "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {isFlagged ? "Flagged" : "Flag for Audit"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DIRECT ACCESS: OFFICIAL GOVERNMENT AGENCIES & AGRONOMY PLATFORMS */}
      <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs space-y-4" id="government-official-links-hub">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Building2 className="text-emerald-700" size={20} />
              Official Government Portals & Agronomy Direct Access Hub
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Verified external public platforms for national agricultural development, food security programs, and grain bank offtakes.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50 w-fit">
            ✓ Live Verified External Portals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              name: "Federal Ministry of Agriculture (FMAFS)",
              desc: "National agricultural policy, fertilizer subsidies, and food security directives.",
              url: "https://agriculture.gov.ng/",
              tag: "Federal Ministry",
            },
            {
              name: "Bank of Agriculture (BOA)",
              desc: "Agricultural credit, food price stabilization, and guaranteed minimum price (GMP) offtake.",
              url: "https://www.boanig.com/",
              tag: "State Agricultural Bank",
            },
            {
              name: "National Agric Development Fund (NADF)",
              desc: "Specialized funding windows, farm input grants, and smallholder resilience facilities.",
              url: "https://nadf.gov.ng/",
              tag: "Development Fund",
            },
            {
              name: "National Agric Seeds Council (NASC)",
              desc: "Certified high-yielding seed varieties, quality control, and seed certification portal.",
              url: "https://seedcouncil.gov.ng/",
              tag: "Seed Quality Board",
            },
            {
              name: "FAO Food & Agriculture Org (UN)",
              desc: "Global food price index, agro-ecological zoning, and pest tracking telemetry.",
              url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/",
              tag: "United Nations",
            },
            {
              name: "World Bank Agriculture Initiative",
              desc: "Smallholder financing programs, climate-smart agriculture, and rural infrastructure.",
              url: "https://www.worldbank.org/en/topic/agriculture",
              tag: "Multilateral Bank",
            },
            {
              name: "KALRO Agricultural Research Org",
              desc: "East African climate-resilient crop research, soil mapping, and agronomy advice.",
              url: "https://www.kalro.org/",
              tag: "Regional Research",
            },
            {
              name: "USDA Foreign & Domestic Ag Service",
              desc: "Global crop assessment, weather impact reports, and commodity forecasts.",
              url: "https://www.usda.gov/",
              tag: "Global Agro-Service",
            },
          ].map((portal, idx) => (
            <a
              key={idx}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl border border-gray-150 hover:border-emerald-500 hover:shadow-md transition-all bg-slate-50/40 hover:bg-white flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-900">
                    {portal.tag}
                  </span>
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-emerald-700 transition-colors shrink-0" />
                </div>
                <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                  {portal.name}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {portal.desc}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span>Access Official Platform</span>
                <span>&rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
