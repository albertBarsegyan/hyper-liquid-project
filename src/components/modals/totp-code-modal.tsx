import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { getErrorMessage } from '@/modules/shared/utils/error.ts';

interface TotpCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<{ success?: boolean; error?: string }>;
  tagName: string;
}

export const TotpCodeModal = ({
  isOpen,
  onClose,
  onSubmit,
  tagName,
}: TotpCodeModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      setCode('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (code.trim().length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitResult = await onSubmit(code.trim());

      if (submitResult.success) {
        // Close modal on successful submission
        onClose();
      } else {
        setError(submitResult.error ?? null);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
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
          'p-8',
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
          disabled={isSubmitting}
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
          Enter TOTP Code
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
          Enter the 6-digit code from your authenticator app for {tagName}
        </p>

        {/* Code Input */}
        <div
          className={cn(
            'mb-6',
            'transform transition-all duration-500 delay-400',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          <label className="mb-2 block text-sm font-medium text-white/90">
            Verification Code
          </label>
          <input
            type="text"
            value={code}
            onChange={e => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
              setError(null);
            }}
            placeholder="000000"
            maxLength={6}
            disabled={isSubmitting}
            className="w-full rounded-lg border bg-white/10 px-4 py-3 text-center text-2xl font-mono text-white placeholder:text-white/30"
            style={{ borderColor: '#97fce4' }}
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter' && code.length === 6) {
                void handleSubmit();
              }
            }}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        {/* Action Buttons */}
        <div
          className={cn(
            'flex gap-3',
            'transform transition-all duration-500 delay-500',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
            style={{ borderColor: '#97fce4' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || code.length !== 6}
            className="flex-1 text-white"
            style={{
              backgroundColor: code.length === 6 ? '#97fce4' : undefined,
              color: code.length === 6 ? '#0e1e27' : undefined,
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </div>
    </div>
  );
};
