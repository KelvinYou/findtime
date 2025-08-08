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
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type CreateScheduleDto = {
  title: string;
  description?: string;
  availableSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  duration: number; // in minutes
  timeZone: string;
};

type UpdateScheduleDto = Partial<CreateScheduleDto>;

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto, @Request() req: any) {
    return this.scheduleService.create(createScheduleDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.scheduleService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Request() req: any,
  ) {
    return this.scheduleService.update(id, updateScheduleDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.scheduleService.remove(id, req.user.id);
  }

  @Get(':id/public')
  async getPublicSchedule(@Param('id') id: string) {
    return this.scheduleService.getPublicSchedule(id);
  }
} 