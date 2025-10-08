import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useReferralCode } from '@/modules/referral/hooks/referral';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ReferralCodeDisplay: React.FC = () => {
  const { data: referralCodeData, isLoading, error } = useReferralCode();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (referralCodeData?.data?.referralCode) {
      try {
        await navigator.clipboard.writeText(referralCodeData.data.referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy referral code:', err);
      }
    }
  };

  const handleCopyUrl = async () => {
    if (referralCodeData?.data?.referralUrl) {
      try {
        await navigator.clipboard.writeText(referralCodeData.data.referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy referral URL:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Code</CardTitle>
          <CardDescription>Loading your referral information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Code</CardTitle>
          <CardDescription>Failed to load referral information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const referralCode = referralCodeData?.data?.referralCode;
  const referralUrl = referralCodeData?.data?.referralUrl;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
        <CardDescription>
          Share this code with friends to earn rewards when they join!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {referralCode && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Referral Code:</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded border font-mono">
                {referralCode}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center gap-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}

        {referralUrl && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Referral Link:</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-muted rounded border font-mono text-xs break-all">
                {referralUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="flex items-center gap-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
