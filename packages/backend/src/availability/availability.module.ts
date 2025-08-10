import { Module } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { BookingController } from '../booking/booking.controller';
import { BookingService } from '../booking/booking.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AvailabilityController, BookingController],
  providers: [AvailabilityService, BookingService],
  exports: [AvailabilityService, BookingService],
})
export class AvailabilityModule {} 