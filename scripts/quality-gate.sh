#!/usr/bin/env bash
# ─── Quality Gate (verify-before-complete) ───
# Run before claiming anything is done
set -euo pipefail
cd /Users/admin/Developer/Projects/bot/uyimiz_bot

echo "🔍 Quality Gate..."
FAIL=0

# TypeCheck
echo -n "  TypeCheck ... "
if pnpm typecheck > /dev/null 2>&1; then echo "✅"; else echo "❌"; FAIL=1; fi

# Lint (if available)
echo -n "  Lint ...... "
if pnpm lint > /dev/null 2>&1; then echo "✅"; else echo "⚠️  (optional)"; fi

# Build
echo -n "  Build ..... "
if pnpm build > /dev/null 2>&1; then echo "✅"; else echo "❌"; FAIL=1; fi

echo ""
if [ $FAIL -eq 0 ]; then
  echo "✅ ALL CHECKS PASSED"
else
  echo "❌ QUALITY GATE FAILED — do not claim complete"
  exit 1
fi
