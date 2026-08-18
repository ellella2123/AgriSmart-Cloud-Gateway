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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-emerald-600 p-1.5 rounded-lg text-white shadow-sm shadow-emerald-200">
              <Sprout size={20} />
            </div>
            <span className="font-black text-lg tracking-tight text-gray-900 hidden lg:inline-block">AgriSmart Ecosystem</span>
          </div>
          
          <div className="flex-grow overflow-x-auto hide-scrollbar">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl w-max mx-auto sm:mx-0 gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ViewType)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeView === item.id ? `bg-white shadow-xs ${item.color}` : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={14} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Ask AgriCompanion AI Sticky Ribbon - placed permanently just below the icons */}
      <div className="bg-emerald-800 text-emerald-100 border-b border-emerald-950 sticky top-16 z-30 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="bg-emerald-750 p-1 rounded-md text-emerald-300 animate-pulse shrink-0">
              <Bot size={14} />
            </div>
            <span className="font-bold text-[11px] sm:text-xs truncate text-emerald-50">
              AgriCompanion AI: Access FMAFS Renewed Hope fertilizer grants & BOA grain stabilisation plans!
            </span>
          </div>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-agrichatbot"));
            }}
            className="shrink-0 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1.5 rounded-lg text-[10px] sm:text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
          >
            <Sparkles size={11} className="text-emerald-700 shrink-0" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      <main className="flex-grow">
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
      </main>

      <AgriChatBot />
    </div>
  );
}

export default App;
