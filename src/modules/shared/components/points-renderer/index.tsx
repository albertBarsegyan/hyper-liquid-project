import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils.ts';

export function PointsRenderer({ points }: { points?: number }) {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleActivate = () => {
    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsActive(true);
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      timeoutRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      onClick={handleActivate}
      onMouseEnter={handleActivate}
      className="fixed right-10  cursor-pointer bottom-16 z-40"
    >
      <div
        className={cn(
          'rounded-full border-2 bg-black animate-border-glow transition-100',
          {
            'opacity-100': isActive,
            'opacity-50': !isActive,
          }
        )}
      >
        <div className="rounded-full text-[12px] md:text-[18px] py-1 px-3 lg:py-2 lg:px-6 flex items-center justify-center">
          {points ?? 0} pts
        </div>
      </div>
    </div>
  );
}
