# syntax=docker/dockerfile:1
FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

ENV NODE_ENV=production
# Cloud Run will inject PORT=8080; the backend already picks it up.
EXPOSE 8080

CMD ["node", "src/server.js"]