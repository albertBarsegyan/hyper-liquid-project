import React from 'react';

interface TickerScrollerProps {
  messages?: string[];
  height?: number;
}

const TickerScroller: React.FC<TickerScrollerProps> = ({
  messages = [
    'Dliqd coin presales 50% cheaper',
    'Limited time offer - Get started today!',
    'Join thousands of users already earning',
  ],
  height = 30,
}) => {
  // Duplicate messages for seamless loop
  const duplicatedMessages = [...messages, ...messages];

  return (
    <div
      className="relative w-full overflow-hidden ticker-container"
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
