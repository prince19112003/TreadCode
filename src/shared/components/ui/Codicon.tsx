import React from 'react';

export interface CodiconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  className?: string;
}

export const Codicon: React.FC<CodiconProps> = ({ name, size, className = '', style, ...props }) => {
  return (
    <span
      className={`codicon codicon-${name} ${className}`}
      style={{
        fontSize: size ? (typeof size === 'number' ? `${size}px` : size) : undefined,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        ...style,
      }}
      {...props}
    />
  );
};
