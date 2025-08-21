import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ProfileModule } from './profile/profile.module';
import { AvailabilityModule } from './availability/availability.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // For production deployment, rely on environment variables
      // For development, use the env file
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : '../../.env',
    }),
    SupabaseModule,
    AuthModule,
    ScheduleModule,
    ProfileModule,
    AvailabilityModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 