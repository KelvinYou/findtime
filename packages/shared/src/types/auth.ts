// Authentication DTOs
export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  email: string;
  password: string;
  name?: string;
};

// Guest user types for local storage
export type GuestUser = {
  name: string;
  email?: string;
};

export type GuestData = {
  user: GuestUser;
  savedAt: string;
};

// Authentication Responses
export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
};

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser;
};

export type ProfileResponse = AuthUser;

// Auth Context Types
export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}; 