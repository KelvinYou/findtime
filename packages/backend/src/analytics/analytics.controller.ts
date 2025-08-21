import { 
  Controller, 
  Get, 
  UseGuards, 
  Request
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  DashboardAnalytics,
  ScheduleAnalytics
} from '@zync/shared';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  async getDashboardAnalytics(@Request() req: any): Promise<DashboardAnalytics> {
    return this.analyticsService.getDashboardAnalytics(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('schedules')
  async getScheduleAnalytics(@Request() req: any): Promise<ScheduleAnalytics> {
    return this.analyticsService.getScheduleAnalytics(req.user.id);
  }
} 