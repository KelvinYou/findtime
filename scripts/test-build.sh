#!/bin/bash

# Test Build Script for Vercel Deployment
# This script mimics the Vercel build process locally

set -e

echo "🔍 Testing Vercel build process locally..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🏗️  Building shared package..."
pnpm nx run @zync/shared:build

echo ""
echo "🎯 Building frontend..."
pnpm nx build frontend

echo ""
echo "✅ Build successful!"
echo ""
echo "📁 Build output directory: packages/frontend/dist"
echo "📊 Build size analysis:"
du -sh packages/frontend/dist/*

echo ""
echo "🚀 You can preview the build locally by running:"
echo "cd packages/frontend && pnpm preview" 