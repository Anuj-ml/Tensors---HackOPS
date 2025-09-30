import { Music, Radio, Volume2, Disc } from 'lucide-react';
import { useState } from 'react';

interface SimpleMusicIconProps {
  variant?: 'vinyl' | 'speaker' | 'equalizer' | 'notes' | 'waveform';
  isPlaying?: boolean;
  className?: string;
}

export function SimpleMusicIcon({ variant = 'vinyl', isPlaying = false, className = '' }: SimpleMusicIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    switch (variant) {
      case 'vinyl':
        return <Disc className={`w-full h-full ${isPlaying ? 'animate-spin' : ''}`} />;
      case 'speaker':
        return <Volume2 className={`w-full h-full ${isPlaying ? 'animate-pulse' : ''}`} />;
      case 'equalizer':
        return <Radio className={`w-full h-full ${isPlaying ? 'animate-bounce' : ''}`} />;
      case 'notes':
      case 'waveform':
      default:
        return <Music className={`w-full h-full ${isPlaying ? 'animate-pulse' : ''}`} />;
    }
  };

  return (
    <div 
      className={`text-[var(--theme-primary)] transition-all duration-300 ${
        isHovered ? 'scale-110 opacity-80' : ''
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getIcon()}
    </div>
  );
}