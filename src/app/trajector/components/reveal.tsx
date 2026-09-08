'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils';

/**
 * Lifts its children into place as they come into view, once.
 *
 * The observer is the only thing that flips the state, so nothing runs on a
 * timer and a section that is already on screen at load settles immediately.
 * Anyone who asked their system for less motion gets the final state with no
 * transition at all — that is a stylesheet concern, not a branch in here.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Milliseconds behind its neighbours, for staggering a row of cards. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // Start a little before the edge, so the motion finishes as it arrives
      // rather than beginning once the reader is already looking at it.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out',
        'motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:!transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}>
      {children}
    </div>
  );
}
