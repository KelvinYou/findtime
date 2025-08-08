import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react/macro';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
};

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { t } = useLingui();
  const { login, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          <Trans id="Sign In" />
        </CardTitle>
        <CardDescription>
          <Trans id="Enter your email and password to access your account" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              <Trans id="Email" />
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t`Enter your email`}
              {...register('email')}
              disabled={isLoading || isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              <Trans id="Password" />
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={t`Enter your password`}
              {...register('password')}
              disabled={isLoading || isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <Trans id="Signing in..." />
              </>
            ) : (
              <Trans id="Sign In" />
            )}
          </Button>

          {onSwitchToRegister && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <Trans id="Don't have an account?" />{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-800 underline"
                  disabled={isLoading || isSubmitting}
                >
                  <Trans id="Sign up" />
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 