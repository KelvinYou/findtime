import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Optional,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  CreateScheduleDto, 
  UpdateScheduleDto, 
  SubmitAvailabilityDto 
} from '@zync/shared';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto, @Request() req: any) {
    // Support both authenticated and guest users
    const userId = req.user?.id || null;
    return this.scheduleService.create(createScheduleDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: any) {
    return this.scheduleService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Request() req: any,
  ) {
    return this.scheduleService.update(id, updateScheduleDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.scheduleService.remove(id, req.user.id);
  }

  @Get(':id/public')
  async getPublicSchedule(@Param('id') id: string) {
    return this.scheduleService.getPublicSchedule(id);
  }

  @Post(':id/availability')
  async submitAvailability(
    @Param('id') id: string, 
    @Body() submitAvailabilityDto: SubmitAvailabilityDto
  ) {
    return this.scheduleService.submitAvailability(id, submitAvailabilityDto);
  }
} 