import React from 'react';
import type { AuthUser } from '@/modules/auth/services/auth.service.ts';
import { clsx } from 'clsx';

interface TickerScrollerProps {
  messages?: string[];
  height?: number;
  authUser?: AuthUser | null;
}

const messagesList = [
  'Dliqd coin presales 50% cheaper',
  'Limited time offer - Get started today!',
  'Join thousands of users already earning',
];

const TickerScroller: React.FC<TickerScrollerProps> = ({
  messages = messagesList,
  height = 30,
  authUser,
}) => {
  // Duplicate messages for seamless loop
  const duplicatedMessages = [...messages, ...messages];

  return (
    <div
      className={clsx(
        'fixed lg:relative z-30 w-full overflow-hidden ticker-container',
        { ['hidden']: Boolean(authUser) }
      )}
      style={{
        height: `${height}px`,
        backgroundColor: '#208c71',
        borderBottom: '1px solid #dfe300',
      }}
    >
      <div className="flex items-center h-full ticker-scroll">
        {duplicatedMessages.map((message, index) => (
          <div
            key={index}
            className="flex items-center whitespace-nowrap px-8"
            style={{ color: '#dfe300' }}
          >
            <span className="text-responsive-base font-medium">{message}</span>
            <span className="mx-8 text-2xl" style={{ color: '#97fce4' }}>
              •
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerScroller;
