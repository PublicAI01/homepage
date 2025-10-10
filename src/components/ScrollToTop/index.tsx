'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useIsClient } from '@/app/hooks';
import BackToTop from '@/assets/svg/back-to-top.svg?react';
import { cn } from '@/utils';

const ScrollToTop = () => {
  const isClient = useIsClient();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const abortCtrl = new AbortController();

    window.addEventListener(
      'scroll',
      () => {
        setVisible(window.scrollY > 300);
      },
      { signal: abortCtrl.signal },
    );

    return () => {
      abortCtrl.abort();
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isClient || typeof window === 'undefined') return null;

  return createPortal(
    <>
      <button
        className={cn(
          'fixed right-5 bottom-5 size-10 cursor-pointer rounded-full bg-neutral-400/60 opacity-0 transition-opacity duration-300 md:right-10 md:bottom-10',
          visible ? 'opacity-100' : '-z-10',
        )}
        type="button"
        onClick={scrollToTop}
        aria-label="scroll to top">
        <BackToTop className="m-auto h-auto w-8 text-white" />
      </button>
    </>,
    document.body,
  );
};

export default ScrollToTop;
