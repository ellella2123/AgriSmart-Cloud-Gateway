# AgriSmart Cloud Gateway

AgriSmart is a full-stack, AI-grounded agricultural operating system designed to turn real-time soil physics, satellite climate data, and offline telecom rails into verified economic power for smallholder farmers.

## Architecture

The application is built on a modern, highly scalable, and cost-efficient cloud architecture:

*   **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion for a premium, responsive glassmorphic UI.
*   **Backend**: Node.js / Express serving as a lightweight API gateway and USSD routing engine.
*   **AI Integration**: Google Gemini API for agronomic suitability assessment, visual crop disease diagnostics, and chat assistance.
*   **Telemetry**: Open-Meteo for real-time 5-day precision weather and precipitation forecasting.
*   **Mapping**: Leaflet and React-Leaflet for interactive GIS / Digital Twin farm visualization.
*   **Deployment (Production)**: Google Cloud Run (Serverless). Docker containerization ensures consistent environments.
*   **USSD / SMS Endpoint**: Express endpoint (`/api/ussd`) ready for integration with aggregators (e.g., Africa's Talking) using standard `CON` (continue) and `END` telecom protocols.

## Cost Note (Nigerian Context & Free Tier Scaling)

This architecture is deliberately designed to minimize infrastructure overhead, making it highly viable for deployment in emerging markets like Nigeria:

1.  **Google Cloud Run (Compute)**: Configured to "scale-to-zero". You only pay when the application is actively processing requests. For an MVP or early-stage rollout, this typically stays entirely within Google Cloud's generous free tier (2 million requests/month). Estimated Cost: **$0.00/month**.
2.  **Google Gemini AI**: The Gemini API offers a free tier suitable for MVP usage and low-volume pilot testing. Estimated Cost: **$0.00/month**.
3.  **Open-Meteo Weather**: The public API is free for non-commercial use (up to 10,000 API calls daily). Estimated Cost: **$0.00/month**.
4.  **USSD/SMS (Future Scaling)**: While the backend webhook is free to host, leasing a dedicated USSD shortcode (e.g., `*2123#`) via telcos (MTN, Airtel, Glo) or aggregators (Africa's Talking) requires a setup fee and monthly maintenance in Naira. The *architecture* is ready; the *cost* is deferred until commercial launch.

## Infrastructure as Code (IaC)

A `terraform/main.tf` configuration is provided to automate the provisioning of the Google Cloud Run service, ensuring repeatable and auditable infrastructure deployments.

## Local Development

```bash
npm install
npm run dev
```

## Production Build & Run

```bash
npm run build
npm start
```
