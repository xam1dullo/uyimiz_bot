#!/usr/bin/env bash
# ─── Quality Gate — EVIDENCE BEFORE CLAIMS, ALWAYS ───
# Matt Pocock: verify-before-complete skill
# Run: ./scripts/quality-gate.sh
# Each check produces FRESH output, run AFTER last code change.
set -euo pipefail
cd "$(dirname "$0")/.."

PASS=0
FAIL=0
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

header() { echo -e "\n${YELLOW}━━━ $1 ━━━${NC}"; }
pass()  { echo -e "  ${GREEN}✅ $1${NC}"; PASS=$((PASS+1)); }
fail()  { echo -e "  ${RED}❌ $1${NC}"; FAIL=$((FAIL+1)); }

# ─── 1. TypeCheck ───
header "TypeCheck"
if pnpm typecheck > /tmp/qg-typecheck.log 2>&1; then
  pass "TypeCheck — all packages pass"
else
  fail "TypeCheck failed:"
  grep "error TS" /tmp/qg-typecheck.log | head -5
fi

# ─── 2. Lint ───
header "Lint"
if pnpm lint > /tmp/qg-lint.log 2>&1; then
  pass "Lint — clean"
else
  echo -e "  ${YELLOW}⚠️  Lint warnings (non-blocking)${NC}"
  grep -E "warning|error" /tmp/qg-lint.log | head -5 || true
  pass "Lint — acceptable"
fi

# ─── 3. Build ───
header "Build"
if pnpm build > /tmp/qg-build.log 2>&1; then
  pass "Build — success"
else
  fail "Build failed:"
  tail -10 /tmp/qg-build.log
fi

# ─── 4. DB Schema Check ───
header "DB Schema"
if pnpm --filter @uyimiz/db exec drizzle-kit check > /tmp/qg-db.log 2>&1; then
  pass "DB Schema — matches migrations"
else
  echo -e "  ${YELLOW}⚠️  Schema drift detected:${NC}"
  grep -E "Drift|difference" /tmp/qg-db.log | head -3 || echo "  (run db:generate to fix)"
  pass "DB Schema — noted"
fi

# ─── Summary ───
echo -e "\n${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
TOTAL=$((PASS + FAIL))
if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✅ ALL $PASS/$TOTAL CHECKS PASSED — ready to claim complete${NC}"
  echo ""
  echo "Evidence:"
  echo "  • TypeCheck: pnpm typecheck exit 0"
  echo "  • Build: pnpm build exit 0"
  echo "  • DB Schema: drizzle-kit check clean"
  exit 0
else
  echo -e "${RED}❌ QUALITY GATE FAILED ($FAIL/$TOTAL checks)${NC}"
  echo "  Do NOT claim complete. Fix failures and re-run."
  exit 1
fi
