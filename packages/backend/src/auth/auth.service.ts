import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto, RegisterDto, LoginResponse, RegisterResponse, AuthUser } from '@zync/shared';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  /**
   * Ensures a profile record exists for the given user
   * Creates one if it doesn't exist
   */
  private async ensureProfileExists(user: any): Promise<void> {
    const supabase = this.supabaseService.getClient();
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (existingProfile) {
      // Profile already exists
      return;
    }
    
    // Create profile record
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.name || user.email?.split('@')[0] || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    
    if (insertError && !insertError.message.includes('duplicate key')) {
      // Ignore duplicate key errors (race condition protection)
      console.warn(`Failed to create profile for user ${user.id}: ${insertError.message}`);
    }
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { email, password, name } = registerDto;
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Ensure profile exists
    if (data.user) {
      await this.ensureProfileExists(data.user);
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || name || email.split('@')[0],
      bio: data.user.user_metadata?.bio,
      avatar_url: data.user.user_metadata?.avatar_url,
      email_confirmed_at: data.user.email_confirmed_at,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at!,
    };

    return {
      message: 'Registration successful. Please check your email for verification.',
      user,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Ensure profile exists
    if (data.user) {
      await this.ensureProfileExists(data.user);
    }

    const payload = {
      sub: data.user.id,
      email: data.user.email,
    };

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
      bio: data.user.user_metadata?.bio,
      avatar_url: data.user.user_metadata?.avatar_url,
      email_confirmed_at: data.user.email_confirmed_at,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at!,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(userId: string): Promise<AuthUser | null> {
    const supabase = this.supabaseService.getClient();
    
    // First try to get user from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError || !authUser?.user) {
      return null;
    }

    const user: AuthUser = {
      id: authUser.user.id,
      email: authUser.user.email!,
      name: authUser.user.user_metadata?.name || authUser.user.email!.split('@')[0],
      bio: authUser.user.user_metadata?.bio,
      avatar_url: authUser.user.user_metadata?.avatar_url,
      email_confirmed_at: authUser.user.email_confirmed_at,
      created_at: authUser.user.created_at,
      updated_at: authUser.user.updated_at!,
    };

    return user;
  }
} 