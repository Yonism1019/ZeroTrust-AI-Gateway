import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
}: GlowButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-electric-cyan to-cyan-500 text-deep-space hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]',
    secondary: 'bg-transparent border-2 border-electric-cyan text-electric-cyan hover:bg-electric-cyan/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]',
    danger: 'bg-gradient-to-r from-alert-red to-orange-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-electric-cyan"
          initial={{ x: '-100%' }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Component>
  );
}
