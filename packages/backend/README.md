# Zync Backend

NestJS backend for the Zync scheduling application.

## Features

- Authentication with Supabase Auth
- Schedule management
- Profile management with avatar uploads
- JWT-based authentication

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables (in root `.env` file):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

3. **Supabase Storage Setup** (Required for profile pictures):
   - Go to your Supabase dashboard → Storage
   - Create a new bucket named `profiles`
   - Set the bucket to public (for avatar URLs to work)
   - Configure RLS policies if needed for security

4. Start the development server:
```bash
pnpm run start:dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout

### Profile Management
- `PUT /api/profile` - Update profile (name, bio)
- `POST /api/profile/avatar` - Upload profile picture

### Schedules
- `GET /api/schedules` - Get user schedules
- `POST /api/schedules` - Create new schedule
- `GET /api/schedules/:id` - Get specific schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule
- `GET /api/schedules/:id/public` - Get public schedule (guest access)
- `POST /api/schedules/:id/availability` - Submit availability

## File Upload

The profile avatar upload endpoint accepts:
- **File types**: JPEG, JPG, PNG, GIF
- **Max size**: 5MB
- **Field name**: `avatar` (multipart/form-data)

Example usage:
```javascript
const formData = new FormData();
formData.append('avatar', file);

fetch('/api/profile/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and data processing
- **Guards**: Authentication and authorization
- **Modules**: Feature organization and dependency injection

The application uses Supabase for:
- User authentication and management
- File storage (profile pictures)
- Database operations (via the main application) 