#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ -z "${OPENAI_API_KEY:-}" ]; then
  export MAF_USE_LOCAL_LLM="${MAF_USE_LOCAL_LLM:-1}"
  export MAF_LOCAL_TEXT_MODEL="${MAF_LOCAL_TEXT_MODEL:-Qwen/Qwen2.5-1.5B-Instruct}"
  export MAF_LOCAL_LLM_LOCAL_FILES_ONLY="${MAF_LOCAL_LLM_LOCAL_FILES_ONLY:-1}"
  export HF_HUB_OFFLINE="${HF_HUB_OFFLINE:-1}"
  export TRANSFORMERS_OFFLINE="${TRANSFORMERS_OFFLINE:-1}"
  export HF_DATASETS_OFFLINE="${HF_DATASETS_OFFLINE:-1}"
  echo "WARNING: OPENAI_API_KEY is not set. LLM-backed text demos will use local HF fallback: ${MAF_LOCAL_TEXT_MODEL}."
fi

export PYTHONPATH="$PROJECT_ROOT"

export NUMBA_CACHE_DIR="${NUMBA_CACHE_DIR:-/tmp/numba-cache-maf-demo}"
export MPLCONFIGDIR="${MPLCONFIGDIR:-/tmp/mpl-maf-demo}"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-/tmp/maf-demo-cache}"
export HF_HOME="${HF_HOME:-$XDG_CACHE_HOME/huggingface}"
export HF_DATASETS_CACHE="${HF_DATASETS_CACHE:-$HF_HOME/datasets}"
export HF_EVALUATE_CACHE="${HF_EVALUATE_CACHE:-$HF_HOME/evaluate}"
mkdir -p "$NUMBA_CACHE_DIR" "$MPLCONFIGDIR" "$HF_HOME" "$HF_DATASETS_CACHE" "$HF_EVALUATE_CACHE"

export MAF_DMLBG_PRETRAINED="${MAF_DMLBG_PRETRAINED:-0}"

if [ -z "${DJANGO_SECRET_KEY:-}" ]; then
  export DJANGO_SECRET_KEY='your_secret_key'
fi

python manage.py migrate --noinput
python manage.py runserver
