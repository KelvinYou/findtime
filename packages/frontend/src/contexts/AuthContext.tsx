import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, AuthUser } from '@zync/shared';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_KEYS } from '@/constants/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by fetching profile
          try {
            const profile = await apiClient.getProfile();
            setUser(profile);
          } catch (error) {
            // Token is invalid, clear auth state
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ email, password });
      
      // Store auth data
      setToken(response.access_token);
      setUser(response.user);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user));

      toast({
        title: 'Welcome back!',
        description: `Successfully logged in as ${response.user.email}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: 'Login failed',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiClient.register({ email, password, name });
      
      toast({
        title: 'Registration successful!',
        description: response.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  const refreshProfile = async (): Promise<void> => {
    if (!token) return;
    
    try {
      const profile = await apiClient.getProfile();
      setUser(profile);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(profile));
    } catch (error) {
      console.error('Error refreshing profile:', error);
      // If profile fetch fails, user might need to login again
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 