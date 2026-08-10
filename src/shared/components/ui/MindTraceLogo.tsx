import React from 'react';

export const TreadCodeLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => (
  <img
    src="/logo.png"
    alt="TreadCode Logo"
    style={{ width: size, height: size, objectFit: 'contain' }}
    className={`select-none pointer-events-none drop-shadow-[0_0_12px_rgba(99,102,241,0.5)] ${className}`}
  />
);
