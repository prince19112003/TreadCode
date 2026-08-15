import React from 'react';

interface TreadCodeLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const TreadCodeLogo: React.FC<TreadCodeLogoProps> = ({
  className = '',
  size = 32,
  glow = true,
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
      filter: glow ? 'drop-shadow(0 0 12px rgba(0, 242, 255, 0.45)) drop-shadow(0 0 24px rgba(168, 85, 247, 0.25))' : 'none',
    }}
    className={`select-none pointer-events-none transition-all duration-500 ${className}`}
  />
);
