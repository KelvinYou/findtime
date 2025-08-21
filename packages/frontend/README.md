# Zync Frontend

Modern React application for the Zync scheduling platform, built with TypeScript, Shadcn UI, and comprehensive internationalization support.

## ✨ Features

- 🗓️ **Smart Scheduling** - Create and manage availability calendars
- 👥 **Guest Booking** - Allow bookings without user registration  
- 🔄 **Recurring Availability** - Set up repeating time slots for freelancers
- 🌍 **Multi-language Support** - English, Malay (Bahasa Malaysia), and Chinese
- 🎨 **Modern UI** - Beautiful, accessible design with Shadcn UI components
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication** - Secure login/register with JWT tokens
- 👤 **Profile Management** - User profiles with avatar uploads
- ⚡ **Fast Development** - Hot reload with Vite
- 🎯 **Type Safety** - Full TypeScript support

## 🏗️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful, accessible UI components
- **React Query** - Server state management and caching
- **React Hook Form** - Performant forms with validation
- **React Router** - Client-side routing
- **Lingui** - Internationalization (i18n) framework
- **Lucide React** - Beautiful icons
- **Zod** - Schema validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Backend API running (see backend README)

### Installation

1. Install dependencies (from project root):
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm run dev
# or from frontend directory:
pnpm run dev
```

3. Open your browser and navigate to `http://localhost:4173`

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run test` - Run tests with Vitest
- `pnpm run test:ui` - Run tests with UI
- `pnpm run lint` - Run ESLint
- `pnpm run extract` - Extract translatable strings
- `pnpm run compile` - Compile translations
- `pnpm run dev:extract` - Extract translations in watch mode

## 📁 Project Structure

```
src/
├── app/                    # Main application
│   └── app.tsx            # Root App component with routing
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   │   ├── AuthModal.tsx      # Login/Register modal
│   │   ├── LoginForm.tsx      # Login form
│   │   ├── RegisterForm.tsx   # Registration form
│   │   ├── ProtectedRoute.tsx # Route protection
│   │   └── UserMenu.tsx       # User dropdown menu
│   ├── availability/      # Availability management
│   │   ├── AvailabilityCalendar.tsx
│   │   ├── FreelancerProfileSetup.tsx
│   │   ├── RecurringAvailabilityManager.tsx
│   │   ├── RecurringScheduleForm.tsx
│   │   ├── TimeSlotForm.tsx
│   │   └── AppointmentsList.tsx
│   ├── layout/            # Layout components
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   └── SidebarLayout.tsx  # Sidebar layout
│   ├── schedule/          # Schedule components
│   │   ├── ScheduleCalendar.tsx
│   │   └── ShareSchedule.tsx
│   └── ui/                # Shadcn UI components
│       ├── button.tsx         # Button variants
│       ├── card.tsx           # Card components
│       ├── calendar.tsx       # Date picker
│       ├── form.tsx           # Form components
│       ├── input.tsx          # Input fields
│       ├── dialog.tsx         # Modal dialogs
│       ├── toast.tsx          # Toast notifications
│       └── ...                # Other UI components
├── contexts/              # React contexts
│   ├── AuthContext.tsx        # Authentication state
│   └── ThemeContext.tsx       # Theme management
├── hooks/                 # Custom React hooks
│   ├── useApi.ts              # API integration hook
│   └── use-toast.ts           # Toast notifications
├── lib/                   # Utility functions
│   ├── queryClient.ts         # React Query setup
│   └── utils.ts               # Utility functions
├── locales/               # Internationalization
│   ├── en.po                  # English translations
│   ├── ms.po                  # Malay translations
│   ├── zh.po                  # Chinese translations
│   └── generated/             # Compiled translations
├── pages/                 # Route components
│   ├── HomePage.tsx           # Landing page
│   ├── LoginPage.tsx          # Login page
│   ├── RegisterPage.tsx       # Registration page
│   ├── DashboardPage.tsx      # User dashboard
│   ├── ProfilePage.tsx        # Profile management
│   ├── AvailabilityPage.tsx   # Availability setup
│   ├── CreateSchedulePage.tsx # Schedule creation
│   ├── ScheduleViewPage.tsx   # Public schedule view
│   ├── BookingPage.tsx        # Booking interface
│   ├── SettingsPage.tsx       # User settings
│   └── AboutPage.tsx          # About page
├── services/              # API services
│   └── api.ts                 # API client
├── constants/             # Application constants
│   ├── routes.ts              # Route definitions
│   └── storage.ts             # Storage keys
├── main.tsx               # Application entry point
└── styles.css             # Global styles and Tailwind imports
```

## 🌍 Internationalization

The application supports three languages using Lingui:

- **English (en)** - Default language
- **Malay (ms)** - Bahasa Malaysia  
- **Chinese (zh)** - 中文

### Working with Translations

All user-facing strings must be wrapped with Lingui's i18n tools:

```tsx
// For JSX content
import { Trans } from '@lingui/react';
<Trans id="Welcome to Zync" />

// For dynamic strings
import { useLingui } from '@lingui/react/macro';
const { t } = useLingui();
const label = t`Download PDF`;
```

### Translation Workflow

1. **Extract** new translatable strings:
```bash
pnpm run extract
```

2. **Update** translations in `.po` files:
   - `locales/en.po` - English
   - `locales/ms.po` - Malay
   - `locales/zh.po` - Chinese

3. **Compile** translations for production:
```bash
pnpm run compile
```

## 🎨 UI Components

The application uses Shadcn UI components for consistent design:

### Core Components
- **Button** - Various styles, sizes, and states
- **Card** - Content containers with headers and footers
- **Form** - Form controls with validation
- **Input** - Text inputs with variants
- **Dialog** - Modal dialogs and overlays
- **Calendar** - Date picker component
- **Toast** - Notification system

### Custom Components
- **AuthModal** - Login/register modal
- **AvailabilityCalendar** - Interactive availability selection
- **ScheduleCalendar** - Schedule display and management
- **UserMenu** - User profile dropdown
- **ProtectedRoute** - Route authentication wrapper

## 🎯 State Management

- **React Query** - Server state, caching, and synchronization
- **React Context** - Global state (auth, theme)
- **React Hook Form** - Form state and validation
- **Local Storage** - Persistent client-side data

## 🔐 Authentication

The frontend handles authentication through:

1. **AuthContext** - Global authentication state
2. **ProtectedRoute** - Route-level protection
3. **JWT Tokens** - Stored securely and auto-refreshed
4. **Guest Access** - Some features available without login

## 🎨 Styling

The application uses Tailwind CSS with:

- **CSS Custom Properties** - Theme variables
- **Dark Mode Support** - Ready for implementation
- **Responsive Design** - Mobile-first approach
- **Component Variants** - Using class-variance-authority
- **Consistent Spacing** - Tailwind spacing scale

## 🛠️ Development

### Adding New Components

1. Create components in appropriate directories
2. Use Shadcn UI patterns for consistency
3. Import and use the `cn` utility for class merging
4. Follow TypeScript best practices
5. Add proper accessibility attributes

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route to `src/app/app.tsx`
3. Update route constants in `src/constants/routes.ts`
4. Add navigation links if needed

### Adding New Translations

1. Wrap strings with `<Trans id="..." />` or `t\`...\``
2. Run `pnpm run extract` to extract strings
3. Update all `.po` files with translations
4. Run `pnpm run compile` to generate JavaScript

### Building for Production

```bash
pnpm run build
```

The built files will be in the `dist/` directory, optimized for production deployment.

## 🚀 Deployment

The frontend is configured for Vercel deployment:

- Automatic builds from Git pushes
- Environment variables configured in Vercel dashboard
- Optimized for serverless deployment

## 🧪 Testing

- **Vitest** - Fast unit testing
- **Testing Library** - Component testing utilities
- **JSdom** - DOM simulation for tests

Run tests:
```bash
pnpm run test        # Run tests
pnpm run test:ui     # Run with UI
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Ensure components are accessible (ARIA attributes)
4. Test on multiple screen sizes
5. Update translations for all supported languages
6. Follow the workspace rules (functional components, named exports, etc.)
7. Use Prettier formatting (2-space indentation, single quotes)

## 📄 License

MIT License - see the main project LICENSE file for details. 