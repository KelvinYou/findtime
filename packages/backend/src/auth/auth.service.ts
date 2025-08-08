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

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || name || email.split('@')[0],
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

    const payload = {
      sub: data.user.id,
      email: data.user.email,
    };

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
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
      email_confirmed_at: authUser.user.email_confirmed_at,
      created_at: authUser.user.created_at,
      updated_at: authUser.user.updated_at!,
    };

    return user;
  }
} 