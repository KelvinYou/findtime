import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards, 
  Request,
  NotFoundException,
  BadRequestException 
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { 
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
  CreateRecurringAvailabilityDto,
  UpdateRecurringAvailabilityDto,
  CreateFreelancerProfileDto,
  UpdateFreelancerProfileDto,
  FreelancerAvailabilityResponse,
  PublicAvailabilityResponse,
  AvailabilityStats,
  AvailabilityTimeSlot,
  RecurringAvailability,
  FreelancerProfile
} from '@zync/shared';

@Controller('availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  // Freelancer Profile Management
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  async createFreelancerProfile(
    @Request() req: any,
    @Body() createProfileDto: CreateFreelancerProfileDto
  ): Promise<FreelancerProfile> {
    return this.availabilityService.createFreelancerProfile(req.user.id, createProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getFreelancerProfile(@Request() req: any): Promise<FreelancerProfile> {
    return this.availabilityService.getFreelancerProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateFreelancerProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateFreelancerProfileDto
  ): Promise<FreelancerProfile> {
    return this.availabilityService.updateFreelancerProfile(req.user.id, updateProfileDto);
  }

  // Time Slot Management
  @UseGuards(JwtAuthGuard)
  @Post('slots')
  async createTimeSlot(
    @Request() req: any,
    @Body() createSlotDto: CreateTimeSlotDto
  ): Promise<AvailabilityTimeSlot> {
    return this.availabilityService.createTimeSlot(req.user.id, createSlotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('slots')
  async getAvailability(
    @Request() req: any,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string
  ): Promise<FreelancerAvailabilityResponse> {
    return this.availabilityService.getUserAvailability(req.user.id, startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Put('slots/:id')
  async updateTimeSlot(
    @Request() req: any,
    @Param('id') slotId: string,
    @Body() updateSlotDto: UpdateTimeSlotDto
  ): Promise<AvailabilityTimeSlot> {
    return this.availabilityService.updateTimeSlot(req.user.id, slotId, updateSlotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('slots/:id')
  async deleteTimeSlot(
    @Request() req: any,
    @Param('id') slotId: string
  ): Promise<{ message: string }> {
    await this.availabilityService.deleteTimeSlot(req.user.id, slotId);
    return { message: 'Time slot deleted successfully' };
  }

  // Recurring Availability Management
  @UseGuards(JwtAuthGuard)
  @Post('recurring')
  async createRecurringAvailability(
    @Request() req: any,
    @Body() createRecurringDto: CreateRecurringAvailabilityDto
  ): Promise<RecurringAvailability> {
    return this.availabilityService.createRecurringAvailability(req.user.id, createRecurringDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recurring')
  async getRecurringAvailability(@Request() req: any): Promise<RecurringAvailability[]> {
    return this.availabilityService.getRecurringAvailability(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('recurring/:id')
  async updateRecurringAvailability(
    @Request() req: any,
    @Param('id') recurringId: string,
    @Body() updateRecurringDto: UpdateRecurringAvailabilityDto
  ): Promise<RecurringAvailability> {
    return this.availabilityService.updateRecurringAvailability(req.user.id, recurringId, updateRecurringDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('recurring/:id')
  async deleteRecurringAvailability(
    @Request() req: any,
    @Param('id') recurringId: string
  ): Promise<{ message: string }> {
    await this.availabilityService.deleteRecurringAvailability(req.user.id, recurringId);
    return { message: 'Recurring availability deleted successfully' };
  }

  // Generate slots from recurring availability
  @UseGuards(JwtAuthGuard)
  @Post('generate-slots')
  async generateSlotsFromRecurring(
    @Request() req: any,
    @Body() body: { start_date: string; end_date: string }
  ): Promise<{ created_slots: number }> {
    const createdSlots = await this.availabilityService.generateSlotsFromRecurring(
      req.user.id, 
      body.start_date, 
      body.end_date
    );
    return { created_slots: createdSlots };
  }

  // Public booking page
  @UseGuards(OptionalJwtAuthGuard)
  @Get('public/:slug')
  async getPublicAvailability(
    @Param('slug') slug: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string
  ): Promise<PublicAvailabilityResponse> {
    return this.availabilityService.getPublicAvailability(slug, startDate, endDate);
  }

  // Analytics and Stats
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getAvailabilityStats(@Request() req: any): Promise<AvailabilityStats> {
    return this.availabilityService.getAvailabilityStats(req.user.id);
  }
} 