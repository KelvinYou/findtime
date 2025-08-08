# API Integration Documentation

## Overview

The schedule application now has complete API integration for **guest users** with:

1. **Guest Schedule Creation** - Anyone can create schedules without authentication by providing their name
2. **Guest Schedule Sharing** - Created schedules get shareable links that work for everyone  
3. **Guest Availability Submission** - Anyone can submit availability using the shared links
4. **Real-time Updates** - After any submission, everyone can see what others have selected

## Architecture

### Backend (NestJS + Supabase)

- **No authentication required** for schedule creation and availability submission
- **Optional authentication** for advanced features (schedule management, editing)
- **Type-safe APIs** using shared TypeScript types
- **Database schema** supports both guest and authenticated users

### Frontend (React + TypeScript)

- **Guest-first design** - Primary flow assumes guest users
- **Creator name collection** during schedule creation
- **API service layer** with error handling and type safety
- **Real-time updates** after availability submission

### Shared Package

- **Common types** supporting guest and authenticated users
- **Type safety** across frontend and backend
- **Single source of truth** for data structures

## Database Schema

The following tables support guest users (see `packages/backend/migrations/`):

- `profiles` - User profile information (optional, for authenticated users)
- `schedules` - Schedule definitions with **optional** user_id and **guest creator info**
- `availability_responses` - Guest availability submissions

### Key Schema Changes for Guest Support

- `schedules.user_id` is now **optional** (nullable)
- Added `schedules.creator_name` (required for guest users)
- Added `schedules.creator_email` (optional for guest users)
- Database constraint ensures either `user_id` OR `creator_name` is provided

## API Endpoints

### Public Schedule Operations (No Auth Required)

- `POST /schedules` - **Create schedule as guest** (provide creator name)
- `GET /schedules/:id/public` - Get schedule details for sharing
- `POST /schedules/:id/availability` - Submit availability as guest

### Authenticated Schedule Management (Optional)

- `GET /schedules` - Get user's schedules (requires auth)
- `PUT /schedules/:id` - Update schedule (requires auth + ownership)
- `DELETE /schedules/:id` - Delete schedule (requires auth + ownership)

## Complete Guest User Flow

### 1. Create Schedule (Guest)

1. **Anyone** opens the create schedule page
2. Enters their **name** (required) and **email** (optional)
3. Fills in schedule title and description
4. Selects available dates and time slots
5. Submits form → API creates schedule **without authentication**
6. Gets shareable link immediately

### 2. Share Schedule

1. Creator gets shareable URL: `/schedule/:id`
2. Can copy link or share via email/SMS
3. **Anyone** can access without authentication
4. Shows creator name from guest info or user profile

### 3. Submit Availability (Guest)

1. Anyone opens shared link
2. Sees schedule details and **creator name**
3. Enters **their name**
4. Selects available time slots
5. Submits → Updates database **without authentication**
6. Real-time display shows their submission

### 4. View Results

1. **Real-time display** of participant count per time slot
2. **Avatar display** of all respondents (guest names)
3. Schedule **refreshes automatically** after submissions

## Guest vs Authenticated User Features

### Guest Users Can:
- ✅ Create schedules (with name)
- ✅ Share schedules via links
- ✅ Submit availability responses
- ✅ View real-time updates
- ❌ Edit existing schedules
- ❌ Delete schedules
- ❌ View their schedule history

### Authenticated Users Can:
- ✅ All guest features
- ✅ Edit their own schedules
- ✅ Delete their own schedules  
- ✅ View schedule management dashboard
- ✅ Profile-based creator display

## Setup Instructions

### Database Setup

Run both migration scripts in order:

```sql
-- 1. Execute packages/backend/migrations/001_initial_schema.sql
-- 2. Execute packages/backend/migrations/002_guest_support.sql
```

### Backend Setup

```bash
cd packages/backend

# Environment variables (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# JWT_SECRET only needed for authenticated features

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
cd packages/frontend

# Environment variables (.env)
VITE_API_URL=http://localhost:3001/api

# Start development server
npm run dev
```

## Key Features Implemented

### Guest-First Design
- **No sign-up required** for core functionality
- **Name-based identification** for creators and participants
- **Immediate access** to schedule creation and sharing

### Type Safety
- **Shared TypeScript types** supporting optional authentication
- **Compile-time checking** for guest vs authenticated flows
- **IntelliSense support** for all scenarios

### Security
- **Public creation** with input validation
- **Row Level Security** allows guest operations
- **Creator identification** via name or user profile
- **No sensitive data exposure**

### User Experience
- **Simplified onboarding** - just provide your name
- **Instant schedule creation** without registration
- **Universal sharing** - works for everyone
- **Real-time collaboration** without barriers

## API Service Usage

```typescript
import { apiClient } from '@/services/api';

// Create schedule as guest
const schedule = await apiClient.createSchedule({
  title: "Team Meeting",
  description: "Weekly sync",
  availableSlots: [
    { date: "2024-02-15", startTime: "09:00", endTime: "10:00" }
  ],
  duration: 60,
  timeZone: "America/New_York",
  // Guest creator info
  creatorName: "John Doe",
  creatorEmail: "john@example.com" // optional
});

// Everything else works the same - no auth needed!
const publicSchedule = await apiClient.getPublicSchedule(scheduleId);

await apiClient.submitAvailability(scheduleId, {
  name: "Jane Smith",
  availability: [
    { date: "2024-02-15", slots: [{ start: "09:00", end: "10:00" }] }
  ]
});
```

## Guest User Benefits

### For Creators:
- **No registration barriers** - start using immediately
- **Simple name-based identification**
- **Email optional** for contact purposes
- **Instant sharing** after creation

### For Participants:
- **Zero friction** - just click and participate
- **Name-only identification** required
- **Immediate feedback** on submissions
- **Real-time collaboration** visibility

### For Organizations:
- **Universal access** - works for internal and external participants
- **No IT setup** required for participants
- **Privacy-friendly** - minimal data collection
- **Scalable** - no user limits or licensing

## Migration from Auth-Required

The system is **backward compatible** - existing authenticated user flows continue to work while adding guest capabilities. You can:

1. **Start with guest mode** for immediate adoption
2. **Add authentication later** for advanced features
3. **Support both flows** simultaneously
4. **Migrate gradually** based on user needs

## Next Steps

The guest user integration is complete and ready for testing:

1. ✅ Run database migrations (both scripts)
2. ✅ Start backend and frontend servers  
3. ✅ Test guest schedule creation flow
4. ✅ Test sharing and availability submission
5. ✅ Verify real-time updates work

**The application now supports full guest user workflows with zero authentication barriers!** 