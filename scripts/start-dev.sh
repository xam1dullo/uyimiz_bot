#!/bin/bash
# @uyimiz_bot — Development Startup Script
# Usage: bash scripts/start-dev.sh

set -e

ROOT="$(dirname "$0")/.."
cd "$ROOT"

# Load env
export $(grep -v '^#' apps/api/.env | xargs)

echo "🚀 Starting @uyimiz_bot..."
echo "   API:    http://localhost:${PORT:-3001}"
echo "   Swagger: http://localhost:${PORT:-3001}/api/docs"
echo ""

cd apps/api
npx tsx dist/main.js
