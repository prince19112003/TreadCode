import React from 'react';

interface TreadCodeLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const TreadCodeLogo: React.FC<TreadCodeLogoProps> = ({
  className = '',
  size = 32,
  glow = false,
}) => (
  <img
    src="/logo.png"
    alt="TreadCode Logo"
    style={{
      width: size,
      height: 'auto',
      maxHeight: size,
      objectFit: 'contain',
      imageRendering: 'auto',
    }}
    className={`select-none pointer-events-none transition-all duration-300 ${
      glow ? 'drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'filter-none'
    } ${className}`}
  />
);
