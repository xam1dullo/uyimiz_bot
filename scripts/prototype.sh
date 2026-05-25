#!/usr/bin/env bash
# ─── Prototype Runner — throwaway code that answers a question ───
# Matt Pocock: prototype skill
# Usage: ./scripts/prototype.sh <name> [logic|ui]
#   logic → terminal app for state/business-logic testing
#   ui    → HTML page with multiple design variations

NAME="${1:-quick-test}"
TYPE="${2:-logic}"
DIR="prototypes/${NAME}"

cd "$(dirname "$0")/.."
mkdir -p "$DIR"

echo "🧪 Creating prototype: ${NAME} (${TYPE})"

case "$TYPE" in
  logic)
    cat > "${DIR}/index.ts" << 'TEMPLATE'
/**
 * 🧪 PROTOTYPE — throwaway code
 * Question: [what are we testing?]
 * 
 * Run: npx tsx prototypes/NAME/index.ts
 * Rules: no persistence, no tests, no polish
 * Delete or absorb when question is answered.
 */

// State under test
interface State {
  // define your state here
}

const state: State = {};

function render(): void {
  console.clear();
  console.log("🧪 PROTOTYPE — State:");
  console.log(JSON.stringify(state, null, 2));
  console.log("\nCommands: [your commands here]");
}

// Main loop
render();
TEMPLATE
    sed -i '' "s/NAME/${NAME}/g" "${DIR}/index.ts"
    echo "  Created: ${DIR}/index.ts"
    echo "  Run: npx tsx ${DIR}/index.ts"
    ;;
  ui)
    cat > "${DIR}/index.html" << 'TEMPLATE'
<!DOCTYPE html>
<html>
<head><title>🧪 Prototype: NAME</title>
<style>
body { font-family: system-ui; padding: 20px; background: #111; color: #eee; }
.variants { display: flex; gap: 10px; margin-bottom: 20px; }
.variant-btn { padding: 8px 16px; border: 1px solid #444; background: #222; color: #eee; cursor: pointer; border-radius: 4px; }
.variant-btn.active { background: #444; border-color: #666; }
.preview { border: 1px dashed #333; border-radius: 8px; padding: 20px; min-height: 200px; }
</style></head>
<body>
<h1>🧪 Prototype: NAME</h1>
<div class="variants">
  <button class="variant-btn active" onclick="switchVariant('a')">Variant A</button>
  <button class="variant-btn" onclick="switchVariant('b')">Variant B</button>
  <button class="variant-btn" onclick="switchVariant('c')">Variant C</button>
</div>
<div id="preview" class="preview">Variant A — design your UI here</div>
<script>
function switchVariant(v) {
  document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('preview').textContent = 'Variant ' + v.toUpperCase() + ' — design your UI here';
}
</script>
</body>
</html>
TEMPLATE
    sed -i '' "s/NAME/${NAME}/g" "${DIR}/index.html"
    echo "  Created: ${DIR}/index.html"
    echo "  Open: open ${DIR}/index.html"
    ;;
esac

echo ""
echo "⚠️  REMEMBER: This is THROWAWAY code."
echo "    Delete after question is answered."
echo "    Capture answer in ADR or commit message."
