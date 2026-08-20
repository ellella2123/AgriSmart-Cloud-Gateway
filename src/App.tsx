import { useState, useEffect } from 'react';
import { Sprout, Landmark, ShoppingBag, Wallet, Globe, Users, Target, ShieldCheck, Award, Bot, Sparkles } from 'lucide-react';

import FarmersDashboard from './components/FarmersDashboard';
import BuyersMarketplace from './components/BuyersMarketplace';
import GovernmentPortal from './components/GovernmentPortal';
import AgriChatBot from './components/AgriChatBot';
import FinancialServices from './components/FinancialServices';
import DigitalTwin from './components/DigitalTwin';
import ExtensionPortal from './components/ExtensionPortal';
import NgoDashboard from './components/NgoDashboard';
import AdminDashboard from './components/AdminDashboard';
import SupportSchemes from './components/SupportSchemes';

import { Certificate, CropListing } from './types';

type ViewType = 'farmer' | 'buyer' | 'financial' | 'twin' | 'extension' | 'government' | 'ngo' | 'admin' | 'schemes';

function App() {
  const [activeView, setActiveView] = useState<ViewType>('farmer');
  
  // Mock State
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [listings, setListings] = useState<CropListing[]>([]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/certificates");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCertificates(data);
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to fetch certificates from API, falling back to local state:", err);
    }
    
    // Fallback static seed data if backend is unreachable or empty
    setCertificates([
      {
        id: "CERT-8201",
        farmerName: "Musa Ibrahim",
        location: "Kano State",
        cropName: "Sorghum",
        soilType: "Sandy Loam",
        fertilityStatus: "Fertile",
        weatherSuitabilityScore: 88,
        temperature: "32°C",
        humidity: "40%",
        rainfall: "Moderate",
        assessmentDate: "2023-11-12",
        loanEligibility: true,
        notes: "Excellent conditions for Sorghum.",
        verificationHash: "0x8fa923be",
        latitude: 11.99,
        longitude: 8.51
      },
      {
        id: "CERT-4192",
        farmerName: "Florence Ade",
        location: "Oyo State",
        cropName: "Cassava",
        soilType: "Clay Loam",
        fertilityStatus: "Moderately Fertile",
        weatherSuitabilityScore: 75,
        temperature: "28°C",
        humidity: "60%",
        rainfall: "High",
        assessmentDate: "2023-11-14",
        loanEligibility: true,
        notes: "Good conditions, soil needs slight amendment.",
        verificationHash: "0x3bc192ef",
        latitude: 8.11,
        longitude: 3.42
      }
    ]);
  };

  useEffect(() => {
    fetchCertificates();
    setListings([
      {
        id: "LIST-001",
        cropName: "Sorghum",
        variety: "Red Sorghum",
        quantity: "50 Bags (50kg)",
        price: "₦25,000 / bag",
        location: "Kano State",
        farmerName: "Musa Ibrahim",
        farmerPhone: "08012345678",
        farmerEmail: "musa@example.com",
        certificateId: "CERT-8201",
        description: "High quality red sorghum harvested last week.",
        createdAt: "2023-11-15",
        latitude: 11.99,
        longitude: 8.51
      }
    ]);
  }, []);

  const handleAddListing = async (newListing: any) => {
    setListings([{ ...newListing, id: `LIST-${Date.now()}`, createdAt: new Date().toISOString() }, ...listings]);
  };

  const handleContactFarmer = async (_listingId: string, _buyerData: any) => {
    return { success: true, message: "Message sent successfully to farmer." };
  };

  const handleRefreshData = async () => {
    await fetchCertificates();
  };

  const navItems = [
    { id: 'farmer', label: 'Farmer Suite', icon: Sprout, color: 'text-emerald-700' },
    { id: 'buyer', label: 'Marketplace', icon: ShoppingBag, color: 'text-amber-700' },
    { id: 'financial', label: 'Credit & Loans', icon: Wallet, color: 'text-blue-700' },
    { id: 'twin', label: 'Digital Twin Map', icon: Globe, color: 'text-indigo-700' },
    { id: 'extension', label: 'Advisory Hub', icon: Users, color: 'text-teal-700' },
    { id: 'ngo', label: 'Co-op Projects', icon: Target, color: 'text-rose-700' },
    { id: 'government', label: 'Govt Registry', icon: Landmark, color: 'text-purple-700' },
    { id: 'schemes', label: 'Govt Support', icon: Award, color: 'text-amber-800' },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, color: 'text-slate-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-800 relative overflow-hidden">
      {/* Neon/Glassmorphic Ambient Background */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/30 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] w-[30%] h-[30%] rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <nav className="bg-white/85 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <div className="max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-1.5 rounded-lg text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <Sprout size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="font-black text-sm sm:text-base lg:text-lg tracking-tight text-gray-900 hidden md:inline-block bg-clip-text text-transparent bg-gradient-to-r from-emerald-950 to-teal-800">
                AgriSmart Ecosystem
              </span>
            </div>
            
            <div className="flex-grow overflow-x-auto hide-scrollbar -mr-2 sm:mr-0 pl-1">
              <div className="flex items-center bg-gray-200/60 backdrop-blur-md p-1 rounded-xl w-max sm:mx-auto gap-0.5 sm:gap-1 border border-white/40 shadow-inner">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as ViewType)}
                    className={`relative px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer hover:bg-white/60 touch-manipulation ${
                      activeView === item.id ? `${item.color}` : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {activeView === item.id && (
                      <span className="absolute inset-0 bg-white shadow-sm rounded-lg border border-white/50 pointer-events-none"></span>
                    )}
                    <item.icon size={13} className="shrink-0 relative z-10 sm:w-3.5 sm:h-3.5" />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Ask AgriCompanion AI Sticky Ribbon */}
        <div className="bg-emerald-950/90 backdrop-blur-lg border-b border-emerald-500/20 sticky top-14 sm:top-16 z-30 shadow-[0_5px_20px_rgba(16,185,129,0.15)]">
          <div className="max-w-[1500px] mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <div className="bg-emerald-500/20 p-1 rounded-md text-emerald-400 animate-pulse shrink-0 border border-emerald-500/30">
                <Bot size={13} className="sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="font-medium text-[11px] sm:text-xs truncate text-emerald-100 tracking-wide">
                <strong className="text-emerald-400 font-bold tracking-wider uppercase text-[10px] mr-1 border border-emerald-500/30 px-1 py-0.5 rounded-sm bg-emerald-500/10 hidden xs:inline">AI Alert</strong>
                Access FMAFS Renewed Hope fertilizer grants & BOA grain stabilisation plans!
              </span>
            </div>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-agrichatbot"));
              }}
              className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs transition-all shadow-[0_0_10px_rgba(16,185,129,0.4)] cursor-pointer flex items-center gap-1 sm:gap-1.5 border border-emerald-400/50 touch-manipulation"
            >
              <Sparkles size={11} className="shrink-0" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        <main className="flex-grow p-2 sm:p-4 lg:p-6 relative z-10 w-full max-w-[1600px] mx-auto">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden w-full">
            {activeView === 'farmer' && (
              <FarmersDashboard 
                 onAddListing={handleAddListing} 
                 certificates={certificates}
                 onRefreshData={handleRefreshData}
              />
            )}
            
            {activeView === 'buyer' && (
              <BuyersMarketplace 
                 listings={listings}
                 certificates={certificates}
                 onContactFarmer={handleContactFarmer}
              />
            )}
            
            {activeView === 'financial' && (
              <FinancialServices certificates={certificates} />
            )}
            
            {activeView === 'twin' && (
              <DigitalTwin certificates={certificates} />
            )}

            {activeView === 'extension' && (
              <ExtensionPortal />
            )}

            {activeView === 'ngo' && (
              <NgoDashboard />
            )}
            
            {activeView === 'government' && (
              <GovernmentPortal 
                 certificates={certificates}
              />
            )}

            {activeView === 'schemes' && (
              <SupportSchemes />
            )}

            {activeView === 'admin' && (
              <AdminDashboard />
            )}
          </div>
        </main>
      </div>

      <AgriChatBot />
    </div>
  );
}

export default App;
