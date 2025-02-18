'use client';

import type { CSSProperties } from 'react';

import styles from '@/components/Card/Card.module.css';
import { cn } from '@/utils';

interface CardProps
  extends Omit<React.ComponentProps<'div'>, 'onMouseEnter' | 'onMouseLeave'> {
  children: React.ReactNode;
  title: string;
  content: string;
}

const Card = (props: CardProps) => {
  const { className, style, children, title, content, ...rest } = props;

  return (
    <div
      className={cn(
        'bg-b2 rounded-xl border border-white p-4 transition-colors hover:bg-white xl:p-6',
        styles.card,
        className,
      )}
      onMouseEnter={(e) => {
        e.currentTarget.classList.remove('animate-card-flicker');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.classList.add('animate-card-flicker');
      }}
      {...rest}>
      {children}
      <h4 className="my-2 text-base font-bold transition-colors md:my-4 md:text-xl xl:text-2xl">
        {title}
      </h4>
      <p className="text-sm font-medium transition-colors md:text-base">
        {content}
      </p>
    </div>
  );
};

export default Card;
