// Loader component with two variants using Tailwind CSS
// - Background color: #0e1e27
// - Loader color: #97fce4
// Usage:
// <FullScreenLoader message="Loading…" variant="fullscreen" />
// <FullScreenLoader message="Loading…" variant="normal" />

type Props = {
  message?: string;
  variant?: 'fullscreen' | 'normal';
  // If you want to show/hide from parent, you can conditionally render this component
};

export function FullScreenLoader({
  message = 'Loading',
  variant = 'fullscreen',
}: Props) {
  const containerClasses =
    variant === 'fullscreen'
      ? 'fixed inset-0 z-50 flex items-center justify-center bg-[#0e1e27]'
      : 'flex items-center justify-center p-8';

  const spinnerSize = variant === 'fullscreen' ? 'h-20 w-20' : 'h-12 w-12';
  const textSize = variant === 'fullscreen' ? 'text-sm' : 'text-xs';

  return (
    <div role="status" aria-live="polite" className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner: SVG circle + tailwind spin */}
        <svg
          className={`${spinnerSize} animate-spin`}
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="g" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#97fce4" stopOpacity="1" />
              <stop offset="100%" stopColor="#97fce4" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Background circle (subtle) */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#0b1216"
            strokeWidth="6"
            opacity="0.12"
          />

          {/* Foreground arc */}
          <path
            d="M25 5
               a20 20 0 0 1 0 40
               a20 20 0 0 1 0 -40"
            stroke="url(#g)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="90"
            strokeDashoffset="60"
          />
        </svg>

        {/* Message (optional) */}
        <div className="text-center">
          <p className={`${textSize} font-medium text-[#97fce4]`}>{message}</p>
          {variant === 'fullscreen' && (
            <p className="mt-1 text-xs text-[#b9f7ef] opacity-70">
              Please wait...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
