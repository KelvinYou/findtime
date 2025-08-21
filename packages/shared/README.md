# Zync Shared

Shared types, constants, and utilities used across the Zync monorepo packages (frontend and backend).

## 📦 What's Included

This package provides common code shared between the frontend and backend:

- **TypeScript Types** - Data transfer objects (DTOs) and API response types
- **Translation Constants** - Internationalization locale definitions
- **Currency Constants** - Shared currency utilities
- **Utility Functions** - Common helper functions

## 🏗️ Package Structure

```
src/
├── types/                 # TypeScript type definitions
│   ├── auth.ts           # Authentication & user types
│   ├── availability.ts   # Availability management types
│   └── schedule.ts       # Schedule & booking types
├── translations/         # i18n constants
│   └── constants/
│       ├── AppLocales.ts # Supported locales
│       └── SourceLocale.ts # Default locale
├── constants/            # Shared constants
│   └── currency.ts       # Currency definitions
├── lib/                  # Utility functions
│   └── shared.ts         # Common utilities
└── index.ts              # Package exports
```

## 📝 Type Definitions

### Authentication Types (`types/auth.ts`)

**DTOs (Data Transfer Objects):**
- `LoginDto` - Login request payload
- `RegisterDto` - Registration request payload
- `UpdateProfileDto` - Profile update payload

**Response Types:**
- `AuthUser` - User profile data
- `LoginResponse` - Login API response
- `RegisterResponse` - Registration API response
- `ProfileResponse` - Profile API response
- `UploadAvatarResponse` - Avatar upload response

**Context Types:**
- `AuthState` - Authentication state structure
- `AuthContextType` - React context interface

**Guest Support:**
- `GuestUser` - Guest user information
- `GuestData` - Guest data with timestamp

### Schedule Types (`types/schedule.ts`)

**Core Types:**
- `TimeSlot` - Time range (start/end times)
- `DateTimeSlots` - Date with associated time slots
- `CreateScheduleDto` - Schedule creation payload
- `UpdateScheduleDto` - Schedule update payload

**Response Types:**
- `ScheduleResponse` - Full schedule data
- `PublicScheduleResponse` - Public schedule view
- `AvailabilityResponse` - Availability submission data

**API Types:**
- `ApiResponse<T>` - Generic API success response
- `ApiError` - API error response structure

### Availability Types (`types/availability.ts`)

Types for managing user availability, recurring schedules, and booking systems.

## 🌍 Translation Constants

### Supported Locales (`translations/constants/AppLocales.ts`)

```typescript
export const APP_LOCALES = {
  'en': 'en',    // English
  'zh': 'zh',    // Chinese
  'ms': 'ms',    // Malay
} as const;
```

### Source Locale (`translations/constants/SourceLocale.ts`)

Defines the default/source locale for the application.

## 💰 Currency Constants

Shared currency definitions and utilities used across the application.

## 🛠️ Development

### Building the Package

```bash
# From project root
nx build shared

# Or from shared directory
pnpm run build
```

### Running Tests

```bash
# From project root
nx test shared

# Or from shared directory
pnpm run test
```

### Using in Other Packages

The shared package is automatically linked to frontend and backend packages via the monorepo setup:

```typescript
// In frontend or backend code
import { AuthUser, LoginDto } from '@zync/shared';
import { APP_LOCALES } from '@zync/shared';
```

## 📋 Type Safety

All types are designed to ensure type safety between frontend and backend:

1. **API Contracts** - DTOs define exact API request/response shapes
2. **Shared Interfaces** - Common data structures prevent mismatches
3. **Strict Types** - No `any` types allowed, full TypeScript coverage
4. **Validation Ready** - Types work with validation libraries (Zod, class-validator)

## 🤝 Contributing

When adding new shared code:

1. **Types** - Add to appropriate files in `types/` directory
2. **Constants** - Add to `constants/` directory
3. **Utilities** - Add to `lib/` directory
4. **Exports** - Update `index.ts` to export new items
5. **Documentation** - Update this README for significant additions

### Guidelines

- Use `type` over `interface` (except when extending third-party types)
- Prefer string literals over enums
- Include JSDoc comments for complex types
- Follow existing naming conventions
- Ensure types work for both frontend and backend use cases

## 📄 License

MIT License - see the main project LICENSE file for details.
