'use client';

import { cn } from '@/utils';

interface CardProps
  extends Omit<React.ComponentProps<'div'>, 'onMouseEnter' | 'onMouseLeave'> {
  children: React.ReactNode;
  title: string;
  content: string;
}

type HtmlElementProps<T extends HTMLElement> = Pick<
  React.HTMLAttributes<T>,
  'onMouseEnter' | 'onMouseLeave'
>;

export const flickerProps: HtmlElementProps<HTMLElement> = {
  onMouseEnter: (e) => {
    e.currentTarget.classList.remove('animate-card-flicker');
  },
  onMouseLeave: (e) => {
    e.currentTarget.classList.add('animate-card-flicker');
  },
};

const Card = (props: CardProps) => {
  const { className, style, children, title, content, ...rest } = props;

  return (
    <div
      className={cn(
        'bg-b2 app-card rounded-xl border border-white p-4 xl:p-6',
        className,
      )}
      {...flickerProps}
      {...rest}>
      {children}
      <h4 className="my-2 text-base font-bold md:my-4 md:text-xl xl:text-2xl">
        {title}
      </h4>
      <p className="text-sm font-medium md:text-base">{content}</p>
    </div>
  );
};

export default Card;
