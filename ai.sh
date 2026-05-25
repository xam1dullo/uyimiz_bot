#!/usr/bin/env bash
# ─── Sub-Agent Runner ───
set -euo pipefail
cd /Users/admin/Developer/Projects/bot/uyimiz_bot

case "${1:-}" in
  -f|--free)     shift; echo "🆓 DeepSeek FREE" && opencode run -m opencode/deepseek-v4-flash-free "$*" 2>&1 ;;
  -n|--nemotron) shift; echo "💚 Nemotron FREE" && opencode run -m opencode/nemotron-3-super-free "$*" 2>&1 ;;
  -b|--big)      shift; echo "🥒 BigPickle FREE" && opencode run -m opencode/big-pickle "$*" 2>&1 ;;
  -p|--copilot)  shift; echo "🤖 Copilot" && copilot -s --prompt "$*" 2>&1 ;;
  *)             echo "🔧 OpenCode" && opencode run "$*" 2>&1 ;;
esac
