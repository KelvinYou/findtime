import { 
  Controller, 
  Put, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto, ProfileResponse, UploadAvatarResponse } from '@zync/shared';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Put()
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<ProfileResponse> {
    return this.profileService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed'), false);
      }
      callback(null, true);
    },
  }))
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadAvatarResponse> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    
    return this.profileService.uploadAvatar(req.user.id, file);
  }
} 