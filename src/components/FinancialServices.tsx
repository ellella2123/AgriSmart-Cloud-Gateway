import { useState } from "react";
import { Wallet, CreditCard, ShieldCheck, Activity, FileCheck, Landmark, CheckCircle, Sparkles } from "lucide-react";
import { Certificate } from "../types";

export default function FinancialServices({ certificates }: { certificates: Certificate[] }) {
  const [activeTab, setActiveTab] = useState<"loans" | "insurance" | "wallet">("loans");
  const [balance, setBalance] = useState(145000);
  const [acceptedLoans, setAcceptedLoans] = useState<string[]>([]);
  
  // Insurance State
  const [insurancePolicy, setInsurancePolicy] = useState<{
    cropName: string;
    coverage: number;
    premium: number;
    status: "active" | "none";
  } | null>(null);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [insuranceCrop, setInsuranceCrop] = useState("Maize");
  const [insuranceCoverage, setInsuranceCoverage] = useState("500000");

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);

  // Success alert state
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const triggerAlert = (text: string) => {
    setAlertMessage(text);
    setTimeout(() => {
      setAlertMessage(null);
    }, 6000);
  };

  const handleAcceptLoan = (certId: string) => {
    if (acceptedLoans.includes(certId)) return;
    setAcceptedLoans(prev => [...prev, certId]);
    setBalance(prev => prev + 50000);
    triggerAlert(`Congratulations! The Input Financing Loan for Certificate #${certId} has been successfully approved and disbursed. ₦50,000 has been instantly credited to your Digital Wallet!`);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (amount > balance) {
      alert("Insufficient funds in your digital wallet.");
      return;
    }
    setBalance(prev => prev - amount);
    setWithdrawAmount("");
    setWithdrawStatus(`Successfully transferred ₦${amount.toLocaleString()} to your linked Mobile Money account!`);
    triggerAlert(`Withdrawal of ₦${amount.toLocaleString()} completed successfully.`);
    setTimeout(() => setWithdrawStatus(null), 5000);
  };

  const handleGetInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    const coverageVal = Number(insuranceCoverage);
    const premiumVal = Math.round(coverageVal * 0.03); // 3% premium rate
    if (premiumVal > balance) {
      alert("Insufficient wallet balance to pay the insurance premium. Please make a deposit or withdraw less.");
      return;
    }
    setInsurancePolicy({
      cropName: insuranceCrop,
      coverage: coverageVal,
      premium: premiumVal,
      status: "active"
    });
    setBalance(prev => prev - premiumVal);
    setShowInsuranceForm(false);
    triggerAlert(`Parametric Climate Insurance activated successfully for your ${insuranceCrop} harvest! Premium of ₦${premiumVal.toLocaleString()} paid from wallet balance.`);
  };

  // Filter certificates
  const eligibleCertificates = certificates.filter(c => c.loanEligibility);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500" id="financial-services-root">
      
      {/* Alert banner */}
      {alertMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl flex items-start gap-3 shadow-sm animate-bounce" id="financial-alert">
          <Sparkles className="text-emerald-700 shrink-0 mt-0.5" size={18} />
          <div className="text-left text-xs font-semibold">{alertMessage}</div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Financial Services & Credit Suite</h2>
          <p className="text-gray-500 mt-1">Access AI-scored micro-loans, parametric weather insurance, and manage your mobile funds.</p>
        </div>
        <div className="bg-emerald-150 p-3 rounded-2xl flex items-center gap-4 shadow-sm border border-emerald-200/50">
           <div className="bg-white p-2 rounded-xl shadow-xs">
             <Wallet className="text-emerald-700" size={24}/>
           </div>
           <div className="text-left">
             <p className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider leading-none">Wallet Balance</p>
             <p className="text-2xl font-black text-emerald-950 mt-1">₦{balance.toLocaleString()}</p>
           </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 w-full sm:w-fit shadow-sm" id="financial-tabs">
        <button
          onClick={() => setActiveTab("loans")}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTab === "loans" ? "bg-emerald-700 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
          id="btn-tab-loans"
        >
          <div className="flex items-center justify-center gap-2">
            <Landmark size={16} /> Micro-Loans
          </div>
        </button>
        <button
          onClick={() => setActiveTab("insurance")}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTab === "insurance" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
          id="btn-tab-insurance"
        >
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={16} /> Climate Insurance
          </div>
        </button>
        <button
          onClick={() => setActiveTab("wallet")}
          className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            activeTab === "wallet" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
          id="btn-tab-wallet"
        >
          <div className="flex items-center justify-center gap-2">
            <CreditCard size={16} /> Digital Wallet
          </div>
        </button>
      </div>

      {/* TAB 1: MICRO-LOANS */}
      {activeTab === "loans" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sec-loans">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-base font-extrabold text-gray-900 text-left">Pre-Approved Custom Credit Offers</h3>
            {eligibleCertificates.length > 0 ? (
              eligibleCertificates.map(cert => {
                const isAccepted = acceptedLoans.includes(cert.id);
                return (
                  <div key={cert.id} className="bg-white rounded-2xl p-6 border border-gray-150 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-left">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                          isAccepted ? "bg-gray-100 text-gray-500" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {isAccepted ? "Disbursed & Active" : "Pre-Approved"}
                        </span>
                        <h4 className="text-lg font-black text-gray-900 mt-2">{cert.cropName} Input Financing</h4>
                        <p className="text-xs text-gray-500 mt-1">Grounded from Certificate {cert.id} • Suitability Score: {cert.weatherSuitabilityScore}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">Limit</p>
                        <p className="text-2xl font-black text-emerald-700 mt-1">₦50,000</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Interest Rate</span>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">2.5% / month</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Term Limit</span>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">6 Months</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Repayment</span>
                        <p className="text-xs font-bold text-gray-800 mt-0.5">Post-Harvest</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleAcceptLoan(cert.id)}
                      disabled={isAccepted}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        isAccepted 
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed" 
                          : "bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm"
                      }`}
                    >
                      {isAccepted ? "✓ Loan Disbursed to Wallet" : "Accept Loan & Transfer to Wallet"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <FileCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h4 className="text-sm font-extrabold text-gray-700">No Eligible Certificates Found</h4>
                <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
                  You need an active climate-suitability certificate with a Weather Suitability Score above 60% to unlock micro-loans. Run an assessment in the Farmer dashboard to trigger pre-approval.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={100} />
              </div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Dynamic AI Credit Score</h3>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-4xl font-black text-emerald-400">
                  {certificates.length > 0 ? 650 + certificates.length * 45 : 550}
                </span>
                <span className="text-base font-bold text-slate-400 pb-1">/ 850</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {certificates.length > 0 
                  ? "Excellent credit ranking. Your farms display high weather resilience and verified soil compatibility." 
                  : "Establish land certificates to generate credit scoring context."
                }
              </p>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Repayment History</span>
                  <span className="font-bold text-emerald-400">100%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
                
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400 font-semibold">Verified Lands</span>
                  <span className="font-bold text-blue-400">{certificates.length} Regions</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div 
                    className="bg-blue-400 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(certificates.length * 25, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-3xs text-left">
               <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Liquidity Banking Partners</h3>
               <div className="space-y-4">
                 {[
                   { name: "Apex Agricultural Credit Bank", rate: "2.5% fixed" },
                   { name: "AgriCapital Micro-Finance Corp", rate: "2.8% fixed" },
                   { name: "AgriSmart Rural Cooperative Co.", rate: "2.4% promo" }
                 ].map((bank, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                       <Landmark className="text-emerald-700" size={16} />
                     </div>
                     <div className="overflow-hidden">
                       <p className="font-bold text-gray-900 text-xs truncate">{bank.name}</p>
                       <p className="text-[9px] text-gray-400 font-bold uppercase">{bank.rate} • API CONNECTED</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARAMETRIC WEATHER INSURANCE */}
      {activeTab === "insurance" && (
        <div className="max-w-3xl mx-auto space-y-6" id="sec-insurance">
          {insurancePolicy ? (
            <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 text-left relative overflow-hidden shadow-md animate-in zoom-in-95 duration-200">
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-700/10 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center gap-3 border-b border-emerald-900 pb-4 mb-4">
                <ShieldCheck className="text-emerald-400" size={28} />
                <div>
                  <h4 className="text-lg font-black">Active Parametric Crop Policy</h4>
                  <p className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider">SECURED BY AGRI-ORACLE SMART CONTRACT</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-[10px] text-emerald-300/70 font-semibold uppercase block">Insured Crop</span>
                  <p className="text-base font-bold text-white">{insurancePolicy.cropName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300/70 font-semibold uppercase block">Total Coverage</span>
                  <p className="text-base font-bold text-white">₦{insurancePolicy.coverage.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300/70 font-semibold uppercase block">Annual Premium Paid</span>
                  <p className="text-base font-bold text-white">₦{insurancePolicy.premium.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300/70 font-semibold uppercase block">Payout Trigger</span>
                  <p className="text-base font-bold text-white">Rainfall Deviation &gt; 45%</p>
                </div>
              </div>
              <div className="bg-emerald-900/60 p-3.5 rounded-xl text-xs text-emerald-100 border border-emerald-800 leading-relaxed">
                <strong>✓ Satellite Protection Live:</strong> Satellite indicators from Copernicus & Sentinel arrays are actively monitoring crop micro-climates. Payouts disperse automatically if rainfall deviations exceed limits.
              </div>
              <button 
                onClick={() => setInsurancePolicy(null)} 
                className="mt-4 text-xs font-semibold text-emerald-300 hover:text-white underline cursor-pointer"
              >
                Cancel Insurance Policy
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center shadow-sm space-y-6">
              <ShieldCheck className="mx-auto h-16 w-16 text-blue-500 mb-2" />
              <div className="text-center">
                <h3 className="text-lg font-black text-gray-900">Parametric Crop Climate Insurance</h3>
                <p className="text-gray-500 text-xs max-w-md mx-auto mt-1 leading-relaxed">
                  Protect your agricultural investments against severe drought or excessive floods. Our parametric model automatically calculates claims based on satellite weather indexing—no paperwork required.
                </p>
              </div>

              {showInsuranceForm ? (
                <form onSubmit={handleGetInsurance} className="bg-gray-50/50 border border-gray-150 p-5 rounded-2xl max-w-md mx-auto text-left space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Crop to Insure</label>
                    <select 
                      value={insuranceCrop} 
                      onChange={(e) => setInsuranceCrop(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="Maize">Maize / Corn</option>
                      <option value="Avocado">Avocado</option>
                      <option value="Rice">Rice Paddy</option>
                      <option value="Sorghum">Sorghum</option>
                      <option value="Cassava">Cassava Root</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Required Coverage Amount</label>
                    <select 
                      value={insuranceCoverage} 
                      onChange={(e) => setInsuranceCoverage(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="200000">₦200,000 Coverage (Premium: ₦6,000)</option>
                      <option value="500000">₦500,000 Coverage (Premium: ₦15,000)</option>
                      <option value="1000000">₦1,000,000 Coverage (Premium: ₦30,000)</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Authorize Policy & Pay Premium
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setShowInsuranceForm(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Configure Parametric Quote
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIGITAL WALLET */}
      {activeTab === "wallet" && (
        <div className="max-w-2xl mx-auto space-y-6" id="sec-wallet">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm text-left space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3">
                <Wallet className="text-indigo-600" size={32} />
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-none">Wallet & Mobile Liquidity</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Sourced from agricultural yields and micro-loans</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Balance</p>
                <p className="text-3xl font-black text-indigo-700">₦{balance.toLocaleString()}</p>
              </div>
            </div>

            {withdrawStatus && (
              <div className="bg-indigo-50 border border-indigo-150 p-4 rounded-xl flex items-center gap-2.5 text-indigo-950 text-xs font-semibold">
                <CheckCircle className="text-indigo-600 shrink-0" size={16} />
                <span>{withdrawStatus}</span>
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4 max-w-md">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fast Mobile Money Withdrawal (M-Pesa / Bank)</h4>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter withdrawal amount (₦)..."
                    className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 rounded-xl py-2.5 px-3.5 text-xs outline-none font-semibold transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  Withdraw Funds
                </button>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                * Disbursements to linked agricultural phone lines settle in less than 60 seconds with no processing charges.
              </p>
            </form>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Records</h4>
              <div className="space-y-2">
                {acceptedLoans.map((loanCert, index) => (
                  <div key={index} className="flex justify-between items-center text-xs bg-gray-50 border border-gray-100 p-3 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">Micro-Loan Credit Ingress</p>
                      <p className="text-[10px] text-gray-400 font-mono">Linked Cert ID: {loanCert}</p>
                    </div>
                    <span className="font-extrabold text-emerald-700">+₦50,000</span>
                  </div>
                ))}
                {insurancePolicy && (
                  <div className="flex justify-between items-center text-xs bg-gray-50 border border-gray-100 p-3 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">Climate Insurance Premium Outflow</p>
                      <p className="text-[10px] text-gray-400 font-mono">Crop: {insurancePolicy.cropName}</p>
                    </div>
                    <span className="font-extrabold text-rose-700">-₦{insurancePolicy.premium.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-800">Initial Account Seeding</p>
                    <p className="text-[10px] text-gray-400 font-mono">System Setup</p>
                  </div>
                  <span className="font-bold text-gray-700">+₦145,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
