import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: 'div' | 'button' | 'a';
  href?: string;
}

export default function Card({
  children,
  className = '',
  hover = true,
  onClick,
  as: Component = 'div',
  ...props
}: CardProps) {
  const hoverStyles = hover
    ? 'transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)]'
    : '';

  return (
    <Component
      onClick={onClick}
      className={`bg-bj-bg-card border border-bj-border overflow-hidden ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-5 pb-[10px] pt-[23px] bg-bj-bg-card-body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border-t border-bj-border pt-3 ${className}`}>{children}</div>;
}
