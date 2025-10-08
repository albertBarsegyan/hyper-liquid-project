import React from 'react';
import { ArrowDown } from 'lucide-react';

interface ActivityAvatarProps {
  type: 'avatar' | 'square';
  background?: string;
  text?: string;
  symbol?: string;
  isReceived?: boolean;
}

export const ActivityAvatar: React.FC<ActivityAvatarProps> = ({
  type,
  background = '#3B82F6',
  text,
  symbol,
  isReceived = false,
}) => {
  if (type === 'square') {
    return (
      <div className="relative">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: background }}
        >
          {text}
        </div>
        {symbol && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs">{symbol}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Avatar with crescent moon background */}
      <div className="w-12 h-12 rounded-full relative overflow-hidden" style={{ backgroundColor: '#1E40AF' }}>
        {/* Crescent moon background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#FBBF24' }}></div>
        </div>
        
        {/* Robot/Knight character */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-800"></div>
          </div>
        </div>
      </div>
      
      {/* Status indicator */}
      {isReceived && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
          <ArrowDown className="w-2 h-2 text-white" />
        </div>
      )}
    </div>
  );
};
