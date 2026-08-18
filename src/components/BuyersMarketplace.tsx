import React, { useState } from "react";
import { 
  Search, MapPin, Tag, User, Phone, FileText, 
  CheckCircle, X, MessageSquare, Landmark, CloudSun, Loader2, Award, Send, Globe
} from "lucide-react";
import { CropListing, Certificate } from "../types";
import AgriculturalMap from "./AgriculturalMap";

interface BuyersMarketplaceProps {
  listings: CropListing[];
  certificates: Certificate[];
  onContactFarmer: (listingId: string, buyerData: { buyerName: string; buyerContact: string; message: string }) => Promise<{ success: boolean; message: string }>;
}

export default function BuyersMarketplace({ listings, certificates, onContactFarmer }: BuyersMarketplaceProps) {
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showMap, setShowMap] = useState(true);

  // Modal State
  const [selectedListing, setSelectedListing] = useState<CropListing | null>(null);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    buyerName: "",
    buyerContact: "",
    message: ""
  });
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Extract unique locations for the filter
  const locations = ["All", ...Array.from(new Set(listings.map((l) => {
    const parts = l.location.split(",");
    return parts[parts.length - 1].trim();
  })))];

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch = 
      l.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const locationParts = l.location.split(",");
    const country = locationParts[locationParts.length - 1].trim();
    const matchesLocation = selectedLocation === "All" || country === selectedLocation;

    const matchesVerification = !onlyVerified || !!l.certificateId;

    return matchesSearch && matchesLocation && matchesVerification;
  });

  // Open modal to view a linked certificate
  const handleViewCertificate = (certId: string) => {
    const cert = certificates.find(c => c.id === certId);
    if (cert) {
      setActiveCert(cert);
    } else {
      alert("This certificate details are archived or pending server synchronization.");
    }
  };

  // Handle contact form submission
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    if (!contactForm.buyerName || !contactForm.buyerContact || !contactForm.message) {
      alert("Please fill in all contact fields.");
      return;
    }

    setIsSendingMessage(true);
    setSuccessMessage(null);

    try {
      const result = await onContactFarmer(selectedListing.id, contactForm);
      if (result.success) {
        setSuccessMessage(result.message);
        setContactForm({ buyerName: "", buyerContact: "", message: "" });
        setTimeout(() => {
          setSuccessMessage(null);
          setShowContactModal(false);
        }, 5000);
      }
    } catch (err: any) {
      alert(`Contact failed: ${err.message}`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="font-sans space-y-8" id="buyers-marketplace-root">
      {/* Search Header Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <span className="px-3 py-1 bg-emerald-800 text-emerald-200 text-xs font-semibold rounded-full uppercase tracking-wider">
            AGRICULTURAL COMMODITIES EXCHANGE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Source Certified Premium Crops
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Browse verified listings, check exact weather suitability scores directly from agricultural certificates, and secure supply agreements with global smallholder farmers.
          </p>
        </div>

        {/* Dynamic crop counts */}
        <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-2xl flex items-center gap-4 shrink-0 self-start md:self-auto">
          <div className="text-center px-4 border-r border-emerald-800">
            <span className="text-2xl font-extrabold text-emerald-200 block">{listings.length}</span>
            <span className="text-[10px] text-emerald-100/60 uppercase font-semibold">Active Batches</span>
          </div>
          <div className="text-center px-2">
            <span className="text-2xl font-extrabold text-emerald-200 block">
              {listings.filter(l => l.certificateId).length}
            </span>
            <span className="text-[10px] text-emerald-100/60 uppercase font-semibold">Verified Safe</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Text Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, variety, or farmer characteristics..."
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Location Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-0.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Origin Country</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:border-emerald-500 outline-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Toggle for verified suitability certificate & Map view */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 h-fit">
              <input
                type="checkbox"
                id="verify-toggle"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="accent-emerald-700 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="verify-toggle" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                Verified Land Certificate Only
              </label>
            </div>

            <button
              onClick={() => setShowMap(!showMap)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                showMap
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {showMap ? "🗺️ Hide Map" : "🗺️ Show Map"}
            </button>
          </div>
        </div>
      </div>

      {/* MAP VIEW OVERVIEW */}
      {showMap && filteredListings.some(l => l.latitude && l.longitude) && (
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-gray-950 flex items-center gap-1.5">
              <Globe className="text-emerald-700" size={16} />
              Commodities Map Overview
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">
              Showing {filteredListings.filter(l => l.latitude && l.longitude).length} active batches geographically
            </span>
          </div>
          <AgriculturalMap
            mode="display-multi"
            items={filteredListings.map((list) => ({
              id: list.id,
              title: list.cropName,
              subtitle: `${list.variety || "Standard"} • ${list.location}`,
              description: list.description,
              latitude: list.latitude,
              longitude: list.longitude,
              badge: list.certificateId ? "Verified" : "Listing",
              badgeColor: list.certificateId ? "gold" : "green",
              price: list.price,
              quantity: list.quantity,
              farmerName: list.farmerName,
              onClickButton: () => {
                setSelectedListing(list);
                setShowContactModal(true);
              },
              buttonText: "📞 Contact Seller"
            }))}
            height="320px"
          />
        </div>
      )}

      {/* Grid Crop Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="marketplace-grid">
        {filteredListings.length > 0 ? (
          filteredListings.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all flex flex-col overflow-hidden relative group"
            >
              {/* Product Cover Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
                <img
                  src={list.imageUrl || "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80"}
                  alt={list.cropName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Linked verification badge */}
                {list.certificateId && (
                  <span className="absolute top-3 left-3 bg-emerald-800/95 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 shadow-xs">
                    <Award size={12} className="text-emerald-300" />
                    Verified Climate Suitable
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{list.variety || "Standard variety"}</span>
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <MapPin size={12} className="text-emerald-700 shrink-0" />
                      {list.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 tracking-tight leading-snug">{list.cropName}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{list.description}</p>
                </div>

                {/* Key specs and pricing */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 bg-gray-50/50 -mx-5 px-5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Batch volume</span>
                    <span className="text-xs font-bold text-gray-800">{list.quantity}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Asking Unit Price</span>
                    <span className="text-xs font-bold text-emerald-800">{list.price}</span>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="flex gap-2.5 pt-1.5">
                  {list.certificateId ? (
                    <button
                      onClick={() => handleViewCertificate(list.certificateId!)}
                      className="flex-1 py-2.5 border border-emerald-100 hover:border-emerald-300 text-emerald-800 text-xs font-bold bg-emerald-50/20 hover:bg-emerald-50/60 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <FileText size={13} />
                      View Certificate
                    </button>
                  ) : (
                    <div className="flex-1 text-center py-2.5 border border-dashed border-gray-200 text-gray-400 text-xs rounded-xl flex items-center justify-center gap-1">
                      No Cert Linked
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSelectedListing(list);
                      setShowContactModal(true);
                    }}
                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <MessageSquare size={13} />
                    Contact Farmer
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-50/50 border border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Tag size={48} className="text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-gray-700">No Harvest Batches Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mt-1">
              No crop listings matched your specific searches or verification toggles. Try adjusting filters or searching globally.
            </p>
          </div>
        )}
      </div>

      {/* --- MODAL 1: SUITABILITY CERTIFICATE MODAL VIEW --- */}
      {activeCert && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-emerald-800 p-5 flex justify-between items-center text-white border-b border-emerald-950/25">
              <div className="flex items-center gap-2.5">
                <FileText className="text-emerald-300" size={20} />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide uppercase">Verified Suitability Certificate</h3>
                  <p className="text-[10px] text-emerald-200/80 font-mono">Certificate ID: {activeCert.id}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveCert(null)}
                className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Top Summary Block */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">FARMER NAME</span>
                  <span className="text-xs font-bold text-gray-700">{activeCert.farmerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">CROP ORIGIN</span>
                  <span className="text-xs font-bold text-gray-700">{activeCert.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">SOIL CLASSIFICATION</span>
                  <span className="text-xs font-bold text-gray-700">{activeCert.soilType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">SUITABILITY INDEX</span>
                  <span className="text-sm font-extrabold text-emerald-800">{activeCert.weatherSuitabilityScore}% Score</span>
                </div>
              </div>

              {/* Climate Stats */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <CloudSun size={13} className="text-gray-400" /> Climate Parameters Checked
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-50/10 border border-emerald-100/10 p-3 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Mean Temperature</span>
                    <span className="text-xs font-bold text-gray-700">{activeCert.temperature}</span>
                  </div>
                  <div className="bg-emerald-50/10 border border-emerald-100/10 p-3 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Ambient Humidity</span>
                    <span className="text-xs font-bold text-gray-700">{activeCert.humidity}</span>
                  </div>
                  <div className="bg-emerald-50/10 border border-emerald-100/10 p-3 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Precipitation Range</span>
                    <span className="text-xs font-bold text-gray-700 truncate block">{activeCert.rainfall}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agronomic Suitability Analysis</h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-emerald-50/20 p-4 rounded-xl border border-emerald-100/30">
                  {activeCert.notes}
                </p>
              </div>

              {/* Loan suitability checklist */}
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Landmark size={20} className="text-emerald-700 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-gray-800">Agricultural Micro-Loan Eligibility</h5>
                    <p className="text-[10px] text-gray-400">Verifies this certificate serves as credit score endorsement for input lenders.</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  activeCert.loanEligibility ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {activeCert.loanEligibility ? "✅ Verified Eligible" : "⚠️ Needs Improvement"}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="text-[10px] font-mono text-gray-400">
                BLOCKCHAIN VERIFICATION SECURITY SEAL
              </div>
              <div className="text-xs font-mono font-bold text-gray-700 tracking-wider bg-white border border-gray-200 px-3 py-1 rounded">
                {activeCert.verificationHash}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CONTACT FARMER DIALOG MODAL --- */}
      {showContactModal && selectedListing && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-emerald-800 p-5 text-white flex justify-between items-center border-b border-emerald-950/25">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="text-emerald-300" size={18} />
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide uppercase">Connect with Farmer</h3>
                  <p className="text-[10px] text-emerald-200/80">Batch: {selectedListing.cropName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {successMessage ? (
                <div className="space-y-4 text-center py-6 animate-in fade-in duration-200">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">Inquiry Sent Successfully!</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                    {successMessage}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Farmer phone: {selectedListing.farmerPhone}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Buyer Name / Company *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.buyerName}
                      onChange={(e) => setContactForm({ ...contactForm, buyerName: e.target.value })}
                      placeholder="e.g. Ceres Foods Wholesale Ltd"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Phone or Email Contact *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.buyerContact}
                      onChange={(e) => setContactForm({ ...contactForm, buyerContact: e.target.value })}
                      placeholder="e.g. buyer@ceresfoods.com or +1 234 567 890"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Your Inquiry Message *</label>
                    <textarea
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder={`Describe your pricing terms, packaging choices, shipping logistics, or general inquiry regarding ${selectedListing.cropName}...`}
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <User size={12} className="text-emerald-700" /> Farmer: {selectedListing.farmerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} className="text-emerald-700" /> {selectedListing.farmerPhone}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingMessage}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    id="btn-submit-contact-farmer"
                  >
                    {isSendingMessage ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-white" />
                        Transmitting message...
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        Transmit Supply Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
