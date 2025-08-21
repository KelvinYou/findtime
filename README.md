# Zync

A smart availability sharing and scheduling platform that helps friends and teams find the perfect time to meet by sharing their free slots.

## ✨ Features

- 🗓️ **Smart Scheduling** - Create and share availability calendars
- 👥 **Guest Support** - Allow others to book time without registration
- 🔄 **Recurring Availability** - Set up repeating time slots for freelancers
- 🌍 **Multi-language Support** - English, Malay, and Chinese
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔐 **Secure Authentication** - JWT-based auth with Supabase
- 📸 **Profile Management** - Upload avatars and manage profiles

## 🏗️ Architecture

This is an Nx monorepo with the following packages:

- **Frontend** (`packages/frontend/`) - React 18 + TypeScript + Shadcn UI
- **Backend** (`packages/backend/`) - NestJS API with Supabase integration
- **Shared** (`packages/shared/`) - Common types, translations, and utilities

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development
- Shadcn UI components
- Tailwind CSS for styling
- React Query for state management
- React Hook Form for forms
- Lingui for internationalization

**Backend:**
- NestJS framework
- Supabase for database and auth
- JWT authentication
- File upload support
- RESTful API design

**Infrastructure:**
- Nx monorepo tooling
- Vercel for deployment
- Supabase for database and storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd find-time
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables (create `.env` in root):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

4. Set up Supabase:
   - Run the migrations in `packages/backend/migrations/`
   - Create a `profiles` storage bucket (public)

5. Start development servers:
```bash
# Start both frontend and backend
pnpm run dev:all

# Or start individually
pnpm run dev          # Frontend only
pnpm run dev:backend  # Backend only
```

### Available Scripts

- `pnpm run dev:all` - Start both frontend and backend
- `pnpm run build:all` - Build both packages
- `pnpm run test:all` - Run all tests
- `pnpm run lint:all` - Lint all packages

## 📁 Project Structure

```
find-time/
├── packages/
│   ├── frontend/          # React application
│   │   ├── src/
│   │   │   ├── components/    # UI components
│   │   │   ├── pages/         # Route components
│   │   │   ├── contexts/      # React contexts
│   │   │   ├── hooks/         # Custom hooks
│   │   │   └── locales/       # i18n translations
│   │   └── package.json
│   ├── backend/           # NestJS API
│   │   ├── src/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── availability/  # Availability management
│   │   │   ├── booking/       # Booking system
│   │   │   ├── profile/       # User profiles
│   │   │   └── schedule/      # Schedule management
│   │   ├── migrations/        # Database migrations
│   │   └── package.json
│   └── shared/            # Shared utilities
│       ├── src/
│       │   ├── types/         # TypeScript types
│       │   ├── translations/  # i18n constants
│       │   └── constants/     # Shared constants
│       └── package.json
├── scripts/               # Build and deployment scripts
└── package.json          # Root package.json
```

## 🌍 Internationalization

The app supports multiple languages using Lingui:

- **English (en)** - Default
- **Malay (ms)** - Bahasa Malaysia  
- **Chinese (zh)** - 中文

### Working with Translations

```bash
# Extract new translatable strings
pnpm run extract

# Compile translations for production
pnpm run compile
```

## 🚀 Deployment

Ready to deploy? We've got you covered:

- **[Quick Deploy Guide](./QUICK_DEPLOY.md)** - Get up and running in 15 minutes
- **[Detailed Deployment Guide](./DEPLOYMENT.md)** - Comprehensive deployment documentation

Both frontend and backend are configured for Vercel serverless deployment with automatic builds.

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Ensure components are accessible
4. Test on multiple screen sizes
5. Update translations for all supported languages
6. Follow the workspace rules in the codebase

## 📄 License

MIT License - see LICENSE file for details.
