import { useState } from 'react';
import { Trans } from '@lingui/react';
import { Share2, Copy, Check, Mail, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type ShareScheduleProps = {
  scheduleId: string;
  scheduleTitle: string;
  onClose?: () => void;
};

export function ShareSchedule({ scheduleId, scheduleTitle, onClose }: ShareScheduleProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Generate shareable URL - in real app this would come from backend
  const shareUrl = `${window.location.origin}/schedule/${scheduleId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link Copied',
        description: 'The schedule link has been copied to your clipboard',
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy link. Please copy it manually.',
        variant: 'destructive',
      });
    }
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Schedule: ${scheduleTitle}`);
    const body = encodeURIComponent(
      `Hi,\n\nI've created a schedule and would like you to add your availability.\n\nPlease visit: ${shareUrl}\n\nThanks!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareSMS = () => {
    const message = encodeURIComponent(
      `Hi! Please add your availability to my schedule "${scheduleTitle}": ${shareUrl}`
    );
    window.open(`sms:?body=${message}`);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="h-5 w-5 mr-2" />
          <Trans id="Share Schedule" />
        </CardTitle>
        <CardDescription>
          <Trans id="Send this link to others so they can add their availability" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Share URL */}
        <div className="space-y-2">
          <Label htmlFor="share-url">
            <Trans id="Schedule Link" />
          </Label>
          <div className="flex gap-2">
            <Input
              id="share-url"
              value={shareUrl}
              readOnly
              className="flex-1"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick Share Options */}
        <div className="space-y-3">
          <Label>
            <Trans id="Quick Share" />
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareEmail}
              className="flex items-center justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              <Trans id="Email" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareSMS}
              className="flex items-center justify-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <Trans id="SMS" />
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <Trans id="Others can use this link to view your schedule and add their own availability times." />
          </p>
        </div>

        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            <Trans id="Close" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 