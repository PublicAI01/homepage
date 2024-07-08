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
        'rounded-xl border border-white bg-b2 p-4 xl:p-6 transition-colors hover:bg-white',
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
      <h5 className="my-4 text-lg font-bold transition-colors md:text-xl xl:text-2xl">
        {title}
      </h5>
      <p className="text-base font-medium transition-colors">{content}</p>
    </article>
  );
};

export default Card;
