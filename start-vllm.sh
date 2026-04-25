#!/usr/bin/env bash

# VLLM_LOGGING_LEVEL=DEBUG uv run vllm serve Qwen/Qwen3.5-9B \
#     --tool-call-parser qwen3_coder \
#     --tensor-parallel-size 4 \
#     --max-model-len 8K  \
#     --max-num-seqs 1  \
#     --enable-auto-tool-choice \
#     --language-model-only \
#     --enable-log-requests \
#     --enable-log-outputs \
#     --reasoning-parser qwen3 \
#     --port 3456

VLLM_LOGGING_LEVEL=DEBUG uv run vllm serve Qwen/Qwen3.6-27B \
    --tool-call-parser qwen3_coder \
    --tensor-parallel-size 4 \
    --max-model-len 8K  \
    --max-num-seqs 1  \
    --enable-auto-tool-choice \
    --language-model-only \
    --enable-log-requests \
    --enable-log-outputs \
    --reasoning-parser qwen3 \
    --port 3456

# VLLM_LOGGING_LEVEL=DEBUG uv run vllm serve openai/gpt-oss-20b \
#     --tensor-parallel-size 4 \
#     --max-model-len 8K  \
#     --max-num-seqs 1  \
#     --enable-auto-tool-choice \
#     --tool-call-parser openai \
#     --enable-log-requests \
#     --enable-log-outputs \
#     --port 3456

