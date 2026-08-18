export interface Certificate {
  id: string;
  farmerName: string;
  location: string;
  cropName: string;
  soilType: string;
  fertilityStatus: "Fertile" | "Barren" | "Moderately Fertile";
  weatherSuitabilityScore: number;
  temperature: string;
  humidity: string;
  rainfall: string;
  assessmentDate: string;
  loanEligibility: boolean;
  notes: string;
  verificationHash: string;
  latitude?: number;
  longitude?: number;
}

export interface CropListing {
  id: string;
  cropName: string;
  variety: string;
  quantity: string;
  price: string;
  location: string;
  farmerName: string;
  farmerPhone: string;
  farmerEmail: string;
  certificateId?: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

export interface ContactMessage {
  id: string;
  listingId: string;
  buyerName: string;
  buyerContact: string;
  message: string;
  createdAt: string;
}

export interface SoilDiagnosis {
  diagnosis: string;
  confidenceScore: number;
  healthStatus: "Healthy" | "Diseased" | "Deficient" | "Barren" | "Unknown";
  observations: string[];
  treatments: string[];
  soilSuitabilityComment: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}
