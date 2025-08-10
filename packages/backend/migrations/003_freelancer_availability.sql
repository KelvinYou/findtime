-- Migration: Freelancer Availability and Booking System
-- Description: Creates tables for freelancer profiles, time slots, recurring availability, and appointments

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Freelancer Profiles Table
-- Stores business information and booking preferences for freelancers
CREATE TABLE freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  services_offered TEXT[], -- Array of services (e.g., ['Consulting', 'Design'])
  hourly_rate DECIMAL(10,2), -- Hourly rate in specified currency
  currency TEXT NOT NULL DEFAULT 'MYR',
  time_zone TEXT NOT NULL DEFAULT 'UTC',
  booking_url_slug TEXT UNIQUE NOT NULL, -- Unique URL identifier (e.g., 'john-doe')
  is_public BOOLEAN NOT NULL DEFAULT true,
  booking_advance_days INTEGER NOT NULL DEFAULT 30, -- How many days in advance bookings are allowed
  cancellation_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_profile UNIQUE(user_id),
  CONSTRAINT valid_booking_advance_days CHECK (booking_advance_days > 0 AND booking_advance_days <= 365),
  CONSTRAINT valid_hourly_rate CHECK (hourly_rate >= 0),
  CONSTRAINT valid_booking_slug CHECK (length(booking_url_slug) >= 3 AND booking_url_slug ~ '^[a-z0-9\-]+$')
);

-- Time Slots Table
-- Individual available time slots that can be booked
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  buffer_time_minutes INTEGER DEFAULT 0, -- Time between appointments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_time_order CHECK (start_time < end_time),
  CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 1440), -- Max 24 hours
  CONSTRAINT valid_buffer_time CHECK (buffer_time_minutes >= 0 AND buffer_time_minutes <= 120), -- Max 2 hours
  CONSTRAINT unique_user_date_time UNIQUE(user_id, date, start_time)
);

-- Recurring Availability Table
-- Patterns for automatically generating time slots (e.g., every Monday 9-5)
CREATE TABLE recurring_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  buffer_time_minutes INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_recurring_time_order CHECK (start_time < end_time),
  CONSTRAINT valid_recurring_duration CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  CONSTRAINT valid_recurring_buffer CHECK (buffer_time_minutes >= 0 AND buffer_time_minutes <= 120)
);

-- Appointments Table
-- Booked appointments with customer information
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_message TEXT,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_appointment_time_order CHECK (start_time < end_time),
  CONSTRAINT valid_customer_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_booking_reference CHECK (length(booking_reference) = 8 AND booking_reference ~ '^[A-Z0-9]+$')
);

-- Indexes for performance optimization
CREATE INDEX idx_freelancer_profiles_user_id ON freelancer_profiles(user_id);
CREATE INDEX idx_freelancer_profiles_slug ON freelancer_profiles(booking_url_slug);
CREATE INDEX idx_freelancer_profiles_public ON freelancer_profiles(is_public) WHERE is_public = true;

CREATE INDEX idx_time_slots_user_id ON time_slots(user_id);
CREATE INDEX idx_time_slots_date ON time_slots(date);
CREATE INDEX idx_time_slots_user_date ON time_slots(user_id, date);
CREATE INDEX idx_time_slots_available ON time_slots(is_available) WHERE is_available = true;
CREATE INDEX idx_time_slots_user_available_date ON time_slots(user_id, is_available, date) WHERE is_available = true;

CREATE INDEX idx_recurring_availability_user_id ON recurring_availability(user_id);
CREATE INDEX idx_recurring_availability_day ON recurring_availability(day_of_week);
CREATE INDEX idx_recurring_availability_active ON recurring_availability(is_active) WHERE is_active = true;

CREATE INDEX idx_appointments_freelancer_id ON appointments(freelancer_id);
CREATE INDEX idx_appointments_time_slot_id ON appointments(time_slot_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_reference ON appointments(booking_reference);
CREATE INDEX idx_appointments_freelancer_date ON appointments(freelancer_id, appointment_date);
CREATE INDEX idx_appointments_freelancer_status ON appointments(freelancer_id, status);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_freelancer_profiles_updated_at BEFORE UPDATE ON freelancer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_availability_updated_at BEFORE UPDATE ON recurring_availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Freelancer profiles policies
CREATE POLICY "Users can view public freelancer profiles" ON freelancer_profiles
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own freelancer profile" ON freelancer_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Time slots policies
CREATE POLICY "Users can view available time slots for public profiles" ON time_slots
    FOR SELECT USING (
        is_available = true AND 
        user_id IN (SELECT user_id FROM freelancer_profiles WHERE is_public = true)
    );

CREATE POLICY "Users can manage their own time slots" ON time_slots
    FOR ALL USING (auth.uid() = user_id);

-- Recurring availability policies
CREATE POLICY "Users can manage their own recurring availability" ON recurring_availability
    FOR ALL USING (auth.uid() = user_id);

-- Appointments policies
CREATE POLICY "Freelancers can view their own appointments" ON appointments
    FOR SELECT USING (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can update their own appointments" ON appointments
    FOR UPDATE USING (auth.uid() = freelancer_id);

-- Allow public appointment creation (booking)
CREATE POLICY "Anyone can create appointments" ON appointments
    FOR INSERT WITH CHECK (true);

-- Allow public appointment viewing by reference
CREATE POLICY "Anyone can view appointments by reference" ON appointments
    FOR SELECT USING (true);

-- Comments for documentation
COMMENT ON TABLE freelancer_profiles IS 'Business profiles for freelancers offering booking services';
COMMENT ON TABLE time_slots IS 'Individual time slots that can be booked by customers';
COMMENT ON TABLE recurring_availability IS 'Recurring patterns for automatically generating time slots';
COMMENT ON TABLE appointments IS 'Booked appointments with customer information';

COMMENT ON COLUMN freelancer_profiles.booking_url_slug IS 'Unique URL identifier for public booking page (e.g., /book/john-doe)';
COMMENT ON COLUMN freelancer_profiles.booking_advance_days IS 'Maximum days in advance customers can book appointments';
COMMENT ON COLUMN time_slots.buffer_time_minutes IS 'Break time after this slot before next appointment can be booked';
COMMENT ON COLUMN recurring_availability.day_of_week IS 'Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday';
COMMENT ON COLUMN appointments.booking_reference IS 'Unique 8-character reference code for customer to track appointment'; 