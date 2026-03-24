#!/bin/sh
set -e

echo "[INFO] Running Prisma migrations..."
npx prisma migrate deploy

echo "[INFO] Running database seed (skip if already seeded)..."
npx prisma db seed || echo "[INFO] Seed skipped or already applied"

echo "[INFO] Starting application..."
node dist/app.js
