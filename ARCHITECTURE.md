# AgriSmart Enterprise Ecosystem

## 1. Overall Solution Architecture
AgriSmart is an offline-first, AI-powered agricultural ecosystem built for national scale. It uses a hybrid Edge/Cloud architecture:
- **Client Tier**: Responsive React SPA (Progressive Web App capable) designed for varied devices (smartphones, tablets, low-end devices).
- **Gateway/BFF**: Express.js Node gateway proxying sensitive LLM inferences, Google Workspace operations, and heavy lifting.
- **Data Tier**: Firebase Firestore providing out-of-the-box offline synchronization for field workers and real-time data replication.
- **AI Tier**: Server-side Gemini API (Pro/Flash) handling disease detection, crop recommendations, chat interactions, and real-time voice translation.

## 2. Complete Project Folder Structure
```
agri-smart/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/    # Reusable UI components (Design System)
â”‚   â”œâ”€â”€ pages/         # High-level route components
â”‚   â”œâ”€â”€ lib/           # Core utilities (Firebase, API clients, Auth)
â”‚   â”œâ”€â”€ hooks/         # Custom React hooks (Data fetching, offline state)
â”‚   â”œâ”€â”€ types/         # TypeScript definitions
â”‚   â””â”€â”€ styles/        # Tailwind configuration & global CSS
â”œâ”€â”€ server/            # Future: Extended microservice route definitions
â”œâ”€â”€ public/            # Static assets
â”œâ”€â”€ server.ts          # Express Gateway Entrypoint
â”œâ”€â”€ ARCHITECTURE.md    # Technical Strategy
â””â”€â”€ package.json
```

## 3. Technology Stack Justification
- **React + Vite**: Enables rapid development, offline PWA capabilities, and highly responsive UI suitable for diverse network conditions.
- **Tailwind CSS**: Enterprise-grade design system consistency with low performance overhead.
- **Firebase Firestore**: Resolves the "Offline communities" requirement instantly with local caching and synchronization upon reconnection.
- **Google GenAI SDK**: Powers the core intelligence (disease detection via images, text translation, agricultural RAG).
- **Express.js**: Securely handles API keys and proxying.

## 4. Database Architecture
Firestore NoSQL Collections:
- `/users`: Farmer digital identity, biometric metadata, roles.
- `/farms`: Geo-fenced land polygons, soil history, sensor logs.
- `/crops`: Historical harvest data, planting cycles.
- `/marketplace`: Commodity listings, warehouse receipts.
- `/financials`: Wallet transactions, micro-loan state.

## 5. Microservice & API Architecture
- `/api/auth`: Handles JWT verifications and RBAC.
- `/api/ai/vision`: Proxies image uploads to Gemini Pro for disease analysis.
- `/api/ai/chat`: Manages multi-turn conversation state with Gemini Flash.
- `/api/workspace`: Proxies Google Workspace actions (Contacts sync, Chat notifications).

## 6. Authentication and Authorization
- **Primary Auth**: Firebase Authentication (Google Sign-in, Email, Phone/SMS capabilities).
- **RBAC**: Custom Claims (Farmer, Extension Officer, Buyer, Admin).
- **Zero Trust**: All backend API endpoints validate Firebase JWTs before processing.

## 7. Design System & UI Component Library
- **Colors**: Earth tones (Green, Brown) mixed with Enterprise Blues.
- **Typography**: Inter (Clean, highly legible on small screens).
- **Components**: Custom built with Tailwind CSS, utilizing `lucide-react` for iconography. Accessible and responsive.

## 8. Development Roadmap
- [x] **Phase 1: Foundation Architecture** (Full-stack setup, Firebase, OAuth, Layouts).
- [x] **Phase 2: Farmer Module & Digital Identity** (Registration, offline profile, GPS mapping).
- [x] **Phase 3: AI Soil & Climate Intelligence** (Gemini computer vision for soil/disease, weather dashboards, Chatbot).
- [x] **Phase 4: Marketplace & Logistics** (Commodity exchange, QR verification).
- [x] **Phase 5: Financial Services** (Digital wallet UI, loan applications).
- [x] **Phase 6: Enterprise Dashboards** (NGO/Government/Extension worker portals).
