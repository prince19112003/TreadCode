import React from 'react';
import {
  CreditCard,
  MessageSquare,
  Package,
  Scale,
  Shield,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Monitor,
  Volume2,
  Key,
  ChevronUp,
  ChevronDown,
  LogOut,
  Info,
  CheckCircle2,
  Download,
  Globe,
  X,
  Check,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  'credit-card': CreditCard,
  'feedback': MessageSquare,
  'package': Package,
  'law': Scale,
  'shield': Shield,
  'link-external': ExternalLink,
  'arrow-left': ArrowLeft,
  'refresh': RefreshCw,
  'vm': Monitor,
  'unmute': Volume2,
  'key': Key,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'log-out': LogOut,
  'info': Info,
  'pass': CheckCircle2,
  'cloud-download': Download,
  'globe': Globe,
  'close': X,
  'check': Check,
};

export interface CodiconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  className?: string;
}

/**
 * Lightweight SVG Icon Adapter (Powered by Lucide React)
 * Replaces heavy @vscode/codicons TTF font file with tree-shaken SVG icons,
 * saving ~2MB font engine memory on 1GB smartboards.
 */
export const Codicon: React.FC<CodiconProps> = ({ name, size, className = '', style, ...props }) => {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  const numSize = typeof size === 'number' ? size : typeof size === 'string' ? parseInt(size, 10) || 16 : 16;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{
        lineHeight: 1,
        verticalAlign: 'middle',
        ...style,
      }}
      {...props}
    >
      <IconComponent size={numSize} />
    </span>
  );
};
