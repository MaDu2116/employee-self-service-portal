# Stage 1: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npx tsc --esModuleInterop --skipLibCheck --outDir ./dist/seed prisma/seed.ts

# Stage 2: Production
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

# Copy only production artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/seed ./dist/seed
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Create uploads directory
RUN mkdir -p uploads

# Entrypoint script: handles migration + seeding + app start
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["/docker-entrypoint.sh"]
