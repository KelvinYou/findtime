# Quick Deployment Guide 🚀

This is a condensed guide to deploy your Zync application to Vercel in just a few steps.

## 🏗️ Project Structure

- **Frontend**: React app (packages/frontend) → Deploy to Vercel Project #1
- **Backend**: NestJS API (packages/backend) → Deploy to Vercel Project #2
- **Database**: Supabase PostgreSQL (external service)

## 📋 Prerequisites

1. ✅ GitHub repository with your code
2. ✅ [Vercel account](https://vercel.com)
3. ✅ [Supabase project](https://supabase.com) set up

## 🎯 Step 1: Deploy Frontend

1. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - **Root Directory**: Leave empty (defaults to root)

2. **Environment Variables**:
   ```
   VITE_API_URL = https://your-backend.vercel.app/api
   ```
   (You'll update this after deploying backend)

3. **Deploy**: Click "Deploy" - Vercel auto-detects the configuration!

## 🔧 Step 2: Deploy Backend

1. **Create Second Vercel Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import the **same** GitHub repository
   - **Root Directory**: Set to `packages/backend`

2. **Environment Variables**:
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsIn...
   JWT_SECRET = your-secure-random-jwt-secret
   FRONTEND_URL = https://your-frontend.vercel.app
   NODE_ENV = production
   ```

3. **Deploy**: Click "Deploy"

## 🔗 Step 3: Connect Frontend & Backend

1. **Update Frontend Environment**:
   - Go to your frontend Vercel project
   - Settings → Environment Variables
   - Update `VITE_API_URL` with your backend URL
   - Redeploy frontend

2. **Test Connection**:
   - Visit your frontend URL
   - Try registering/logging in
   - Check browser Network tab for API calls

## 🛠️ Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsIn...
JWT_SECRET=your-secure-random-jwt-secret
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

## 🧪 Local Testing

Before deploying, test builds locally:

```bash
# Test frontend build
./scripts/test-build.sh

# Test backend build
./scripts/test-backend-build.sh
```

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend build fails | Run `pnpm nx build frontend` locally |
| Backend build fails | Run `cd packages/backend && pnpm build` |
| API calls fail | Check CORS settings and environment variables |
| Database errors | Verify Supabase keys and run migrations |

## 📦 Deployment URLs

After deployment, you'll have:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.vercel.app/api`
- **Health Check**: `https://your-backend.vercel.app/api/health`

## ✅ Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend health endpoint responds
- [ ] User registration works
- [ ] User login works
- [ ] API calls succeed
- [ ] CORS is properly configured
- [ ] Environment variables are set

## 🔄 Redeployment

Future deployments are automatic:
- Push to `main` branch → Both projects redeploy automatically
- Preview deployments on pull requests
- Environment variables persist between deployments

---

**Need more details?** See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide. 