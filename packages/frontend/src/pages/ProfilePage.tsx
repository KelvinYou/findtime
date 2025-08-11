import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Camera, Save, User, Mail, Calendar, Shield } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/services/api';

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePicture: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email.slice(0, 2).toUpperCase() || 'U';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setFormData(prev => ({ ...prev, profilePicture: file }));
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // First update profile information
      if (formData.name !== user?.name || formData.bio !== user?.bio) {
        await apiClient.updateProfile({
          name: formData.name,
          bio: formData.bio,
        });
      }

      // Then upload avatar if a new one was selected
      if (formData.profilePicture) {
        await apiClient.uploadAvatar(formData.profilePicture);
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      
      setIsEditing(false);
      setPreviewUrl(null);
      await refreshProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      profilePicture: null,
    });
    setPreviewUrl(null);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <Trans id="Profile" />
          </h1>
          <p className="text-muted-foreground">
            <Trans id="Manage your personal information and preferences" />
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Trans id="Edit Profile" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5 text-primary" />
            <Trans id="Profile Picture" />
          </CardTitle>
          <CardDescription>
            <Trans id="Upload a profile picture to personalize your account" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
                         <Avatar className="h-24 w-24">
               {previewUrl ? (
                 <AvatarImage src={previewUrl} alt="Profile preview" />
               ) : user?.avatar_url ? (
                 <AvatarImage src={user.avatar_url} alt="Profile picture" />
               ) : (
                 <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                   {initials}
                 </AvatarFallback>
               )}
             </Avatar>
            
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Camera className="mr-2 h-4 w-4" />
                      <Trans id="Change Picture" />
                    </span>
                  </Button>
                </Label>
                <Input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  <Trans id="JPG, PNG or GIF. Max size 5MB." />
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />
            <Trans id="Personal Information" />
          </CardTitle>
          <CardDescription>
            <Trans id="Update your personal details" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                <Trans id="Full Name" />
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  {user?.name || <Trans id="Not set" />}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Trans id="Email Address" />
              </Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </div>
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  <Trans id="Email cannot be changed. Contact support if needed." />
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              <Trans id="Bio" />
            </Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            ) : (
                             <div className="text-sm text-muted-foreground">
                 {user?.bio || <Trans id="No bio added yet" />}
               </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            <Trans id="Account Information" />
          </CardTitle>
          <CardDescription>
            <Trans id="View your account details and status" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                <Trans id="Member Since" />
              </Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                                 <div className="text-sm text-muted-foreground">
                   {user?.created_at 
                     ? new Date(user.created_at).toLocaleDateString()
                     : <Trans id="Unknown" />
                   }
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                <Trans id="Account Status" />
              </Label>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="text-sm text-muted-foreground">
                  <Trans id="Active" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex space-x-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                <Trans id="Saving..." />
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <Trans id="Save Changes" />
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <Trans id="Cancel" />
          </Button>
        </div>
      )}
    </div>
  );
} 