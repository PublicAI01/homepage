'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import BackToTop from '@/assets/svg/back-to-top.svg?react';
import { cn } from '@/utils';

const ScrollToTop = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {mounted &&
        createPortal(
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
        )}
    </>
  );
};

export default ScrollToTop;
