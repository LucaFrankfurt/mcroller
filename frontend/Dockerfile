# syntax=docker/dockerfile:1

# Install dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js app
FROM node:20-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_BACKEND_URL="http://localhost:4000"
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV PORT=8080

# Copy only the necessary output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

EXPOSE 8080
CMD ["npm", "run", "start"]
