'use client';

import clsx from 'clsx';
import type { CSSProperties, FC, ReactNode } from 'react';

import styles from '@/components/Card/Card.module.css';

const Card: FC<{
  className?: string;
  children: ReactNode;
  title: string;
  content: string;
}> = ({ className, children, title, content }) => {
  return (
    <article
      className={clsx(
        'rounded-xl border border-white bg-b2 p-4 transition-colors hover:bg-white xl:p-6',
        styles.card,
        className,
      )}
      style={
        {
          '--duration': '0.4',
        } as CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.classList.remove('animate-card-flicker');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.classList.add('animate-card-flicker');
      }}>
      {children}
      <h4 className="my-2 text-base font-bold transition-colors md:my-4 md:text-xl xl:text-2xl">
        {title}
      </h4>
      <p className="text-sm font-medium transition-colors md:text-base">
        {content}
      </p>
    </article>
  );
};

export default Card;
