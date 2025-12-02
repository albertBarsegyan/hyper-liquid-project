import { useEffect, useState } from 'react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';

interface TotpSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  qrCode: string;
  manualEntryKey: string;
}

export const TotpSetupModal = ({
  isOpen,
  onClose,
  onVerify,
  qrCode,
  manualEntryKey,
}: TotpSetupModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      setVerificationCode('');
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(manualEntryKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleVerify = async () => {
    if (verificationCode.trim().length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const success = await onVerify(verificationCode.trim());
      if (success) {
        // Close modal on successful verification
        onClose();
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch {
      setError('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[10000] flex items-center justify-center p-4',
        'transition-opacity duration-300',
        isAnimating ? 'opacity-100' : 'opacity-0'
      )}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm',
          'transition-opacity duration-300',
          isAnimating ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Modal Content */}
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-2xl',
          'bg-gradient-to-br from-purple-900/95 to-blue-900/95',
          'border border-purple-500/30 shadow-2xl',
          'p-8 max-h-[90vh] overflow-y-auto',
          'transform transition-all duration-500 ease-out',
          isAnimating
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-4 opacity-0'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          onClick={onClose}
          aria-label="Close modal"
          disabled={isVerifying}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Title */}
        <h2
          className={cn(
            'mb-2 text-2xl font-bold text-white',
            'transform transition-all duration-500 delay-200',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          Setup Two-Factor Authentication
        </h2>

        <p
          className={cn(
            'mb-6 text-sm text-white/70',
            'transform transition-all duration-500 delay-300',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          Scan the QR code with your authenticator app or enter the key manually
        </p>

        {/* QR Code */}
        <div
          className={cn(
            'mb-6 flex justify-center',
            'transform transition-all duration-500 delay-400',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          <div
            className="rounded-lg border-2 bg-white p-4"
            style={{ borderColor: '#97fce4' }}
          >
            <img src={qrCode} alt="TOTP QR Code" className="h-48 w-48" />
          </div>
        </div>

        {/* Manual Entry Key */}
        <div
          className={cn(
            'mb-6',
            'transform transition-all duration-500 delay-500',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          <label className="mb-2 block text-sm font-medium text-white/90">
            Manual Entry Key
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualEntryKey}
              readOnly
              className="flex-1 rounded-lg border bg-white/10 px-4 py-2 text-sm text-white"
              style={{ borderColor: '#97fce4' }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="h-10 w-10 border-white/20 text-white hover:bg-white/10"
              style={{ borderColor: '#97fce4' }}
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Verification Code Input */}
        <div
          className={cn(
            'mb-4',
            'transform transition-all duration-500 delay-600',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          <label className="mb-2 block text-sm font-medium text-white/90">
            Enter Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={e => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
              setError(null);
            }}
            placeholder="000000"
            maxLength={6}
            disabled={isVerifying}
            className="w-full rounded-lg border bg-white/10 px-4 py-3 text-center text-2xl font-mono text-white placeholder:text-white/30"
            style={{ borderColor: '#97fce4' }}
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter' && verificationCode.length === 6) {
                void handleVerify();
              }
            }}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            'flex gap-3',
            'transform transition-all duration-500 delay-700',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isVerifying}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            style={{ borderColor: '#97fce4' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || verificationCode.length !== 6}
            className="flex-1 text-white"
            style={{
              backgroundColor:
                verificationCode.length === 6 ? '#97fce4' : undefined,
              color: verificationCode.length === 6 ? '#0e1e27' : undefined,
            }}
          >
            {isVerifying ? 'Verifying...' : 'Verify & Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
};
