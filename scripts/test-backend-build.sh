#!/bin/bash

# Test Backend Build Script for Vercel Deployment
# This script mimics the Vercel build process for the backend

set -e

echo "🔍 Testing Backend Vercel build process locally..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

echo "📦 Installing dependencies..."
cd packages/backend
pnpm install

echo ""
echo "🏗️  Building shared package..."
cd ../shared
pnpm nx run @zync/shared:build

echo ""
echo "🎯 Building backend..."
cd ../backend
pnpm run build

echo ""
echo "✅ Backend build successful!"
echo ""
echo "📁 Build output directory: packages/backend/dist"
echo "📊 Build contents:"
ls -la dist/

echo ""
echo "🚀 Backend is ready for Vercel deployment!"
echo "📋 Remember to set these environment variables in Vercel:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY" 
echo "   - JWT_SECRET"
echo "   - FRONTEND_URL (optional)"
echo "   - NODE_ENV=production" 