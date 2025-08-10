import { useState, useEffect } from 'react';
import { Trans } from '@lingui/react';
import { Save, AlertCircle, Check } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/api';
import { FreelancerProfile, CreateFreelancerProfileDto, UpdateFreelancerProfileDto } from '@zync/shared';
import { CURRENCIES } from '@zync/shared/constants/currency';

type FreelancerProfileSetupProps = {
  existingProfile?: FreelancerProfile | null;
  onProfileCreated: (profile: FreelancerProfile) => void;
  isEditing?: boolean;
};

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

export function FreelancerProfileSetup({ 
  existingProfile, 
  onProfileCreated, 
  isEditing = false 
}: FreelancerProfileSetupProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: existingProfile?.business_name || '',
    description: existingProfile?.description || '',
    services_offered: existingProfile?.services_offered || [],
    hourly_rate: existingProfile?.hourly_rate || '',
    currency: existingProfile?.currency || 'MYR',
    time_zone: existingProfile?.time_zone || 'UTC',
    booking_url_slug: existingProfile?.booking_url_slug || '',
    is_public: existingProfile?.is_public ?? true,
    booking_advance_days: existingProfile?.booking_advance_days || 30,
    cancellation_policy: existingProfile?.cancellation_policy || '',
  });
  const [serviceInput, setServiceInput] = useState('');

  // Generate slug from business name
  useEffect(() => {
    if (!isEditing && formData.business_name && !formData.booking_url_slug) {
      const slug = formData.business_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50);
      setFormData(prev => ({ ...prev, booking_url_slug: slug }));
    }
  }, [formData.business_name, isEditing]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddService = () => {
    if (serviceInput.trim() && !formData.services_offered.includes(serviceInput.trim())) {
      handleInputChange('services_offered', [...formData.services_offered, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  const handleRemoveService = (service: string) => {
    handleInputChange('services_offered', formData.services_offered.filter(s => s !== service));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profileData = {
        business_name: formData.business_name,
        description: formData.description || undefined,
        services_offered: formData.services_offered.length > 0 ? formData.services_offered : undefined,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate.toString()) : undefined,
        currency: formData.currency,
        time_zone: formData.time_zone,
        booking_url_slug: formData.booking_url_slug,
        booking_advance_days: formData.booking_advance_days,
        cancellation_policy: formData.cancellation_policy || undefined,
        is_public: formData.is_public,
      };

      let profile: FreelancerProfile;
      
      if (isEditing && existingProfile) {
        profile = await apiClient.updateFreelancerProfile(profileData as UpdateFreelancerProfileDto);
        toast({
          title: 'Profile updated',
          description: 'Your freelancer profile has been updated successfully',
        });
      } else {
        profile = await apiClient.createFreelancerProfile(profileData as CreateFreelancerProfileDto);
        toast({
          title: 'Profile created',
          description: 'Your freelancer profile has been created successfully',
        });
      }

      onProfileCreated(profile);
    } catch (error) {
      console.error('Profile save error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bookingUrl = `${window.location.origin}/book/${formData.booking_url_slug}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans id="Business Information" />
          </CardTitle>
          <CardDescription>
            <Trans id="Basic details about your freelance business" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business_name">
              <Trans id="Business Name" /> *
            </Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => handleInputChange('business_name', e.target.value)}
              placeholder="Your Business Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              <Trans id="Description" />
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your services..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>
              <Trans id="Services Offered" />
            </Label>
            <div className="flex space-x-2">
              <Input
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                placeholder="Add a service"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
              />
              <Button type="button" onClick={handleAddService} variant="outline">
                <Trans id="Add" />
              </Button>
            </div>
            {formData.services_offered.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.services_offered.map((service) => (
                  <Badge key={service} variant="secondary" className="cursor-pointer">
                    {service}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(service)}
                      className="ml-2 text-xs"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans id="Pricing & Location" />
          </CardTitle>
          <CardDescription>
            <Trans id="Set your rates and timezone preferences" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">
                <Trans id="Hourly Rate" />
              </Label>
              <Input
                id="hourly_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.hourly_rate}
                onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">
                <Trans id="Currency" />
              </Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time_zone">
              <Trans id="Time Zone" />
            </Label>
            <Select value={formData.time_zone} onValueChange={(value) => handleInputChange('time_zone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans id="Booking Settings" />
          </CardTitle>
          <CardDescription>
            <Trans id="Configure how customers can book with you" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking_url_slug">
              <Trans id="Booking URL" /> *
            </Label>
            <Input
              id="booking_url_slug"
              value={formData.booking_url_slug}
              onChange={(e) => handleInputChange('booking_url_slug', e.target.value)}
              placeholder="your-name"
              required
              pattern="^[a-z0-9\-]+$"
            />
            {formData.booking_url_slug && (
              <p className="text-sm text-muted-foreground">
                <Trans id="Your booking page will be available at:" /> <br />
                <code className="text-blue-600">{bookingUrl}</code>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking_advance_days">
              <Trans id="Booking Advance Days" />
            </Label>
            <Input
              id="booking_advance_days"
              type="number"
              min="1"
              max="365"
              value={formData.booking_advance_days}
              onChange={(e) => handleInputChange('booking_advance_days', parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">
              <Trans id="How many days in advance customers can book appointments" />
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellation_policy">
              <Trans id="Cancellation Policy" />
            </Label>
            <Textarea
              id="cancellation_policy"
              value={formData.cancellation_policy}
              onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
              placeholder="Describe your cancellation policy..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => handleInputChange('is_public', checked)}
            />
            <Label htmlFor="is_public">
              <Trans id="Make booking page public" />
            </Label>
          </div>
          <p className="text-sm text-muted-foreground">
            <Trans id="When enabled, customers can find and book appointments on your public page" />
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
              <Trans id="Saving..." />
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? <Trans id="Update Profile" /> : <Trans id="Create Profile" />}
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 