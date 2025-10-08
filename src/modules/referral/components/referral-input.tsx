import React, { useState } from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { useValidateReferralCode, useApplyReferralCode } from '@/modules/referral/hooks/referral';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ReferralInputProps {
  onSuccess?: () => void;
}

export const ReferralInput: React.FC<ReferralInputProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message?: string } | null>(null);

  const validateMutation = useValidateReferralCode();
  const applyMutation = useApplyReferralCode();

  const handleValidateCode = async () => {
    if (!code.trim()) {
      setValidationResult({ valid: false, message: 'Please enter a referral code' });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateMutation.mutateAsync(code.trim().toUpperCase());
      if (result.data?.valid) {
        setValidationResult({ valid: true, message: 'Valid referral code!' });
      } else {
        setValidationResult({ valid: false, message: 'Invalid or expired referral code' });
      }
    } catch (error) {
      setValidationResult({ valid: false, message: 'Failed to validate referral code' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleApplyCode = async () => {
    if (!code.trim() || !validationResult?.valid) return;

    try {
      await applyMutation.mutateAsync(code.trim().toUpperCase());
      onSuccess?.();
      setCode('');
      setValidationResult(null);
    } catch (error) {
      setValidationResult({ valid: false, message: 'Failed to apply referral code' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!validationResult) {
        handleValidateCode();
      } else if (validationResult.valid) {
        handleApplyCode();
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Have a Referral Code?
        </CardTitle>
        <CardDescription>
          Enter a referral code to earn bonus rewards when you join
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter referral code"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            disabled={applyMutation.isPending}
          />
          
          {validationResult && (
            <Alert className={validationResult.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={validationResult.valid ? 'text-green-800' : 'text-red-800'}>
                {validationResult.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-2">
          {!validationResult ? (
            <Button
              onClick={handleValidateCode}
              disabled={isValidating || !code.trim()}
              className="flex-1"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                'Validate Code'
              )}
            </Button>
          ) : validationResult.valid ? (
            <Button
              onClick={handleApplyCode}
              disabled={applyMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Code'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleValidateCode}
              disabled={isValidating || !code.trim()}
              className="flex-1"
            >
              Try Again
            </Button>
          )}
        </div>

        {validationResult?.valid && (
          <p className="text-sm text-muted-foreground">
            🎉 You'll receive bonus rewards when you complete your first deposit!
          </p>
        )}
      </CardContent>
    </Card>
  );
};
