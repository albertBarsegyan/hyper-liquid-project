import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';

interface SignupSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: string;
}

export const SignupSuccessModal = ({
  isOpen,
  onClose,
  amount = '5',
}: SignupSuccessModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation after mount
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

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
          'relative z-10 w-full max-w-md rounded-2xl bg-gradient-to-br from-purple-900/95 to-blue-900/95',
          'border border-purple-500/30 shadow-2xl',
          'p-8 text-center',
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
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Animated Check Icon */}
        <div
          className={cn(
            'mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full',
            'bg-gradient-to-br from-green-400 to-emerald-500',
            'shadow-lg shadow-green-500/50',
            'transform transition-all duration-700 ease-out',
            isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          )}
        >
          <CheckCircle2
            className={cn(
              'h-12 w-12 text-white',
              'transform transition-all duration-500 delay-300',
              isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
          />
        </div>

        {/* Title */}
        <h2
          className={cn(
            'mb-4 text-3xl font-bold text-white',
            'transform transition-all duration-500 delay-200',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          Congratulations!
        </h2>

        {/* Message */}
        <p
          className={cn(
            'mb-6 text-lg text-white/90',
            'transform transition-all duration-500 delay-300',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          You received{' '}
          <span className="font-bold text-yellow-300">{amount} Dliqd</span>
        </p>

        {/* Confetti Effect (CSS-based) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute h-2 w-2 rounded-full',
                i % 3 === 0
                  ? 'bg-yellow-400'
                  : i % 3 === 1
                    ? 'bg-green-400'
                    : 'bg-blue-400',
                'animate-ping',
                'opacity-0'
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={onClose}
          className={cn(
            'mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500',
            'text-white hover:from-purple-600 hover:to-blue-600',
            'transform transition-all duration-500 delay-400',
            isAnimating
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          )}
        >
          Awesome!
        </Button>
      </div>
    </div>
  );
};
