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

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
};

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { t } = useLingui();
  const { register: registerUser, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      await registerUser(data.email, data.password, data.name);
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
          <Trans id="Create Account" />
        </CardTitle>
        <CardDescription>
          <Trans id="Enter your information to create a new account" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              <Trans id="Name" /> <span className="text-gray-500">(<Trans id="optional" />)</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={t`Enter your name`}
              {...register('name')}
              disabled={isLoading || isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              <Trans id="Confirm Password" />
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t`Confirm your password`}
              {...register('confirmPassword')}
              disabled={isLoading || isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
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
                <Trans id="Creating account..." />
              </>
            ) : (
              <Trans id="Create Account" />
            )}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                <Trans id="Already have an account?" />{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:text-blue-800 underline"
                  disabled={isLoading || isSubmitting}
                >
                  <Trans id="Sign in" />
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 