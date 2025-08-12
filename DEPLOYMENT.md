# Deployment Guide

This guide covers deploying the Zync application to Vercel.

## Project Structure

This is an Nx monorepo with the following packages:
- `packages/frontend` - React frontend application (Vite + TypeScript)
- `packages/backend` - NestJS backend application
- `packages/shared` - Shared types and utilities

## Frontend Deployment to Vercel

The repository is configured for automatic frontend deployment to Vercel using the `vercel.json` configuration.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Integration**: Connect your GitHub repository to Vercel
3. **Environment Variables**: Configure required environment variables

### Environment Variables

The following environment variables need to be configured in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-backend.vercel.app/api` |

### Deployment Steps

#### Option 1: Automatic Deployment (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**:
   - Vercel will automatically detect the configuration from `vercel.json`
   - The build command, output directory, and install command are pre-configured

3. **Set Environment Variables**:
   - In your Vercel project dashboard, go to "Settings" → "Environment Variables"
   - Add `VITE_API_URL` with your backend API URL

4. **Deploy**:
   - Push to the main branch to trigger automatic deployment
   - Vercel will build and deploy your application

#### Option 2: Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /path/to/your/project
   vercel
   ```

3. **Follow the prompts** to configure your project

### Build Configuration

The project uses the following build configuration (defined in `vercel.json`):

- **Build Command**: `pnpm nx run @zync/shared:build && pnpm nx build frontend`
- **Output Directory**: `packages/frontend/dist`
- **Install Command**: `pnpm install`
- **Dev Command**: `pnpm nx serve frontend --port $PORT`

### Deployment Features

The Vercel configuration includes:

- **SPA Routing**: All routes redirect to `index.html` for client-side routing
- **Security Headers**: Content-Type options, frame options, and XSS protection
- **Optimized Build**: Production-ready assets with compression

### Backend Deployment

The backend (`packages/backend`) is a NestJS application configured for serverless deployment on Vercel.

#### Environment Variables for Backend

Configure these environment variables in your Vercel backend project:

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsIn...` |
| `JWT_SECRET` | Secret for JWT token signing | `your-secure-random-jwt-secret` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-frontend.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |

#### Backend Deployment Steps

1. **Create Separate Vercel Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import the same GitHub repository
   - Set the **Root Directory** to `packages/backend`

2. **Configure Build Settings**:
   - Vercel will detect the `vercel.json` in the backend directory
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

3. **Set Environment Variables**:
   - In your backend Vercel project dashboard, go to "Settings" → "Environment Variables"
   - Add all the required environment variables listed above

4. **Deploy**:
   - Push to the main branch to trigger deployment
   - The backend will be available at `https://your-backend.vercel.app/api`

#### Backend Architecture

The backend is configured for serverless deployment with:
- **Serverless Adapter**: Custom Express adapter for Vercel Functions
- **CORS Configuration**: Automatically configured for frontend domains
- **Environment Handling**: Production-ready environment variable loading
- **Database**: Supabase PostgreSQL with Row Level Security

#### Alternative Deployment Options

1. **Railway**: Deploy to Railway for a persistent Node.js backend
2. **Heroku**: Deploy to Heroku with PostgreSQL addon
3. **AWS/GCP/Azure**: Deploy to your preferred cloud provider
4. **DigitalOcean App Platform**: Deploy with managed database

### Connecting Frontend and Backend

After deploying both frontend and backend:

1. **Update Frontend Environment Variables**:
   - In your frontend Vercel project, update `VITE_API_URL`
   - Set it to your backend URL: `https://your-backend.vercel.app/api`

2. **Update Backend CORS Configuration**:
   - In your backend Vercel project, set `FRONTEND_URL`
   - Set it to your frontend URL: `https://your-frontend.vercel.app`

3. **Test the Connection**:
   - Visit your frontend URL
   - Try logging in or registering
   - Check browser network tab for API calls

### Testing Builds Locally

Use the provided scripts to test builds before deployment:

```bash
# Test frontend build
./scripts/test-build.sh

# Test backend build  
./scripts/test-backend-build.sh
```

### Troubleshooting

#### Build Failures

1. **Shared Package Build Issues**:
   - Ensure the shared package builds successfully: `pnpm nx run @zync/shared:build`
   - Check TypeScript configurations in `packages/shared/tsconfig.lib.json`

2. **Frontend Build Issues**:
   - Test locally: `pnpm nx build frontend`
   - Check for missing environment variables
   - Verify all imports are correctly resolved

#### Runtime Issues

1. **API Connection Issues**:
   - Verify `VITE_API_URL` is correctly set
   - Ensure the backend is deployed and accessible
   - Check CORS configuration on the backend

2. **Route Issues**:
   - Verify the SPA routing configuration in `vercel.json`
   - Check React Router configuration

#### Backend-Specific Issues

1. **Environment Variable Issues**:
   - Verify all required backend environment variables are set
   - Check Supabase connection by testing the `/api/health` endpoint
   - Ensure `JWT_SECRET` is properly configured

2. **Database Connection Issues**:
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
   - Check Supabase project status and quotas
   - Ensure database migrations have been run

3. **CORS Issues**:
   - Verify `FRONTEND_URL` is set correctly
   - Check that the frontend domain is whitelisted
   - Test API endpoints directly using tools like Postman

4. **Serverless Function Issues**:
   - Check Vercel function logs in the dashboard
   - Verify the `serverless.js` file is being built correctly
   - Ensure function timeout limits are adequate for your operations

### Performance Optimization

The build process includes several optimizations:

- **Code Splitting**: Large chunks are automatically split
- **Tree Shaking**: Unused code is removed
- **Asset Optimization**: Images and assets are optimized
- **Gzip Compression**: Assets are compressed for faster loading

For additional optimization:
- Consider using dynamic imports for large components
- Optimize images and assets
- Configure chunk splitting in Vite configuration

### Monitoring

After deployment, monitor your application:

- **Vercel Analytics**: Enable in your Vercel project settings
- **Error Tracking**: Consider integrating Sentry or similar
- **Performance**: Use Vercel's built-in performance monitoring

## Development Workflow

For development and staging deployments:

1. **Preview Deployments**: Every pull request gets a preview deployment
2. **Branch Deployments**: Configure branch-specific deployments
3. **Environment Management**: Use different environment variables for staging/production

## Support

For deployment issues:
- Check Vercel's [documentation](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Test the build process locally first 