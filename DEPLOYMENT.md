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

The backend (`packages/backend`) is a NestJS application that can be deployed separately:

1. **Vercel**: Create a separate Vercel project for the backend
2. **Railway**: Deploy to Railway for a Node.js backend
3. **Heroku**: Deploy to Heroku
4. **AWS/GCP/Azure**: Deploy to your preferred cloud provider

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