FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy remaining application source
COPY . .

# Build the Vite frontend and bundle the Express server into dist/server.cjs
RUN npm run build

# Runner stage: Lightweight image for production
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

# Start the compiled CommonJS server bundle
CMD ["node", "dist/server.cjs"]
