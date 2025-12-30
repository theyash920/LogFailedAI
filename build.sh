#!/usr/bin/env bash
# Build script for Render deployment
set -e

echo "===== Installing Python dependencies ====="
pip install -r requirements.txt

echo ""
echo "===== Installing frontend dependencies ====="
cd frontend
npm install

echo ""
echo "===== Building frontend for production ====="
npm run build

echo ""
echo "===== Build complete! ====="
ls -la dist/
