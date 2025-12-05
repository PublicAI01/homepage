'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useIsClient } from '@/app/hooks';
import { cn } from '@/utils';

function Modal(
  props: Omit<
    React.ComponentProps<'dialog'>,
    'ref' | 'onClick' | 'onClose' | 'onCancel' | 'aria-modal'
  > & {
    bodyClassName?: string;
    visible?: boolean;
    close?: () => void;
  },
) {
  const { className, bodyClassName, visible = false, close, ...rest } = props;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(visible);

  const preciseTimeout = useCallback((callback: () => void, delay: number) => {
    const start = performance.now();
    function check(timestamp: number) {
      if (timestamp - start >= delay) {
        callback();
      } else {
        requestAnimationFrame(check);
      }
    }
    requestAnimationFrame(check);
  }, []);

  const handleClose = useCallback(() => {
    preciseTimeout(() => {
      setOpen(false);
    }, 300);
  }, [preciseTimeout]);

  const handleCancel = useCallback(() => {
    close?.();
    handleClose();
  }, [close, handleClose]);

  const handleOpen = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const isClient = useIsClient();
  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        handleOpen();
      });
    }
  }, [handleOpen, visible]);

  useEffect(() => {
    if (visible) {
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    } else {
      dialogRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (open) {
      handleOpen();
    }
  }, [handleOpen, open]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const isClickInsideDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (!isClickInsideDialog) {
      close?.();
    }
  };

  if (!isClient || !open) {
    return null;
  }

  return createPortal(
    <dialog
      aria-modal="true"
      className={cn(
        'fixed top-1/2 left-1/2 z-50 -translate-1/2 transition-discrete',
        'transition-discrete duration-300 not-open:transform-[scale(95%)] not-open:opacity-0 not-open:ease-out starting:open:opacity-0',
        'backdrop:fixed backdrop:inset-0 backdrop:bg-black/50 backdrop:backdrop-blur-xs backdrop:duration-300 not-open:backdrop:opacity-0 not-open:backdrop:ease-out open:backdrop:ease-in starting:open:backdrop:opacity-0',
        'bg-b2 rounded-md border border-white/10 bg-center px-6 py-4 max-md:min-w-xs md:rounded-xl md:py-8',
        className,
      )}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      onClose={handleClose}
      ref={dialogRef}>
      <section
        className={cn(
          'flex flex-col items-center gap-4 md:gap-6',
          bodyClassName,
        )}
        role="dialog">
        {rest.children}
      </section>
    </dialog>,
    document.body,
  );
}

export default Modal;
