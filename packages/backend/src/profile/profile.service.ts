import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProfileDto, AuthUser, UploadAvatarResponse } from '@zync/shared';

@Injectable()
export class ProfileService {
  constructor(private supabaseService: SupabaseService) {}

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<AuthUser> {
    const supabase = this.supabaseService.getClient();

    // Get current user data first
    const { data: currentUser, error: getUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (getUserError || !currentUser?.user) {
      throw new BadRequestException('User not found');
    }

    // Merge existing metadata with new data
    const updatedMetadata = {
      ...currentUser.user.user_metadata,
      ...(updateProfileDto.name !== undefined && { name: updateProfileDto.name }),
      ...(updateProfileDto.bio !== undefined && { bio: updateProfileDto.bio }),
    };

    // Update user metadata in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: updatedMetadata,
      }
    );

    if (authError) {
      throw new BadRequestException('Failed to update profile: ' + authError.message);
    }

    const user = authData.user;
    
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email!.split('@')[0],
      bio: user.user_metadata?.bio,
      avatar_url: user.user_metadata?.avatar_url,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at!,
    };
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<UploadAvatarResponse> {
    const supabase = this.supabaseService.getClient();

    // Generate unique filename
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles') // Make sure this bucket exists in Supabase
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      throw new BadRequestException('Failed to upload avatar: ' + uploadError.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Get current user data to merge metadata
    const { data: currentUser, error: getUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (getUserError || !currentUser?.user) {
      throw new BadRequestException('User not found');
    }

    // Update user metadata with avatar URL
    const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...currentUser.user.user_metadata,
          avatar_url: avatarUrl,
        },
      }
    );

    if (authError) {
      throw new BadRequestException('Failed to update user avatar: ' + authError.message);
    }

    const user = authData.user;
    
    const updatedUser: AuthUser = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || user.email!.split('@')[0],
      bio: user.user_metadata?.bio,
      avatar_url: avatarUrl,
      email_confirmed_at: user.email_confirmed_at,
      created_at: user.created_at,
      updated_at: user.updated_at!,
    };

    return {
      avatar_url: avatarUrl,
      user: updatedUser,
    };
  }
} 