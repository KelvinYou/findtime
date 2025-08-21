# Zync Backend

NestJS backend API for the Zync scheduling application with Supabase integration.

## ✨ Features

- 🔐 **Authentication** - JWT-based auth with Supabase Auth
- 📅 **Schedule Management** - Create, update, and share schedules
- 👤 **Profile Management** - User profiles with avatar uploads
- 🔄 **Availability System** - Recurring and one-time availability slots
- 📝 **Booking System** - Handle appointment bookings
- 👥 **Guest Support** - Allow bookings without registration
- 📁 **File Upload** - Profile picture uploads to Supabase Storage

## 🏗️ Architecture

The backend follows NestJS modular architecture:

```
src/
├── auth/              # Authentication & authorization
│   ├── guards/        # JWT guards (required/optional)
│   └── strategies/    # Passport JWT strategy
├── availability/      # Availability management
├── booking/          # Booking system
├── profile/          # User profile management
├── schedule/         # Schedule CRUD operations
└── supabase/         # Supabase service integration
```

## 🚀 Setup

### Prerequisites

- Node.js 18+
- Supabase account and project
- Environment variables configured

### Installation

1. Install dependencies (from project root):
```bash
pnpm install
```

2. Configure environment variables in root `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

3. **Database Setup**:
   - Run migrations in `migrations/` folder:
     - `001_initial_schema.sql` - Core tables
     - `002_guest_support.sql` - Guest booking support
     - `003_freelancer_availability.sql` - Recurring availability

4. **Supabase Storage Setup** (Required for profile pictures):
   - Go to Supabase Dashboard → Storage
   - Create a new bucket named `profiles`
   - Set bucket to public for avatar URLs
   - Configure RLS policies as needed

5. Start the development server:
```bash
pnpm run dev:backend
# or from backend directory:
pnpm run start:dev
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | User registration | ❌ |
| `POST` | `/api/auth/login` | User login | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
| `POST` | `/api/auth/logout` | User logout | ✅ |

### Profile Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `PUT` | `/api/profile` | Update profile (name, bio) | ✅ |
| `POST` | `/api/profile/avatar` | Upload profile picture | ✅ |

### Schedule Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/schedules` | Get user schedules | ✅ |
| `POST` | `/api/schedules` | Create new schedule | ✅ |
| `GET` | `/api/schedules/:id` | Get specific schedule | ✅ |
| `PUT` | `/api/schedules/:id` | Update schedule | ✅ |
| `DELETE` | `/api/schedules/:id` | Delete schedule | ✅ |
| `GET` | `/api/schedules/:id/public` | Get public schedule (guest access) | ❌ |

### Availability Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/schedules/:id/availability` | Submit availability for schedule | ❌* |
| `GET` | `/api/availability` | Get user availability | ✅ |
| `POST` | `/api/availability` | Create availability slot | ✅ |
| `PUT` | `/api/availability/:id` | Update availability | ✅ |
| `DELETE` | `/api/availability/:id` | Delete availability | ✅ |

*Can be used by guests without authentication

### Booking System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/booking` | Create booking | ❌* |
| `GET` | `/api/booking` | Get user bookings | ✅ |
| `PUT` | `/api/booking/:id` | Update booking status | ✅ |
| `DELETE` | `/api/booking/:id` | Cancel booking | ✅ |

*Guests can create bookings without authentication

## 📁 File Upload

### Profile Avatar Upload

**Endpoint**: `POST /api/profile/avatar`

**Requirements**:
- **File types**: JPEG, JPG, PNG, GIF
- **Max size**: 5MB
- **Field name**: `avatar` (multipart/form-data)
- **Authentication**: Required (JWT token)

**Example Usage**:
```javascript
const formData = new FormData();
formData.append('avatar', file);

const response = await fetch('/api/profile/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Response**:
```json
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "https://supabase-storage-url/profiles/user-id/avatar.jpg"
}
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Login/Register** to receive a JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Optional Auth** endpoints use `OptionalJwtAuthGuard` for guest access
4. **Required Auth** endpoints use `JwtAuthGuard` for protected routes

### Guards

- `JwtAuthGuard` - Requires valid JWT token
- `OptionalJwtAuthGuard` - Allows both authenticated and guest access

## 🗄️ Database Schema

The backend uses Supabase PostgreSQL with the following main tables:

- `users` - User accounts and profiles
- `schedules` - Schedule definitions
- `availability` - Time slot availability
- `bookings` - Appointment bookings
- `recurring_availability` - Freelancer recurring slots

See `migrations/` folder for complete schema definitions.

## 🛠️ Development

### Available Scripts

- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run start:prod` - Start production server

### Project Structure

```
src/
├── app.controller.ts      # Root controller
├── app.module.ts         # Main application module
├── app.service.ts        # Root service
├── main.ts              # Application entry point
├── serverless.ts        # Vercel serverless handler
├── auth/                # Authentication module
├── availability/        # Availability management
├── booking/            # Booking system
├── profile/            # Profile management
├── schedule/           # Schedule operations
└── supabase/           # Supabase integration
```

## 🚀 Deployment

The backend is configured for Vercel serverless deployment:

- `vercel.json` - Vercel configuration
- `serverless.ts` - Serverless handler
- Automatic builds from Git pushes

## 🤝 Contributing

1. Follow NestJS best practices
2. Use TypeScript for all code
3. Implement proper error handling
4. Add validation using class-validator
5. Update API documentation for new endpoints
6. Test with both authenticated and guest users

## 📄 License

MIT License - see the main project LICENSE file for details. 