'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn, preciseTimeout } from '@/utils';

interface ModalProps
  extends Omit<React.ComponentProps<'dialog'>, 'onClick' | 'aria-modal'> {
  bodyClassName?: string;
  visible?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = (props: ModalProps) => {
  const {
    className,
    bodyClassName,
    visible = false,
    setVisible,
    ...rest
  } = props;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(visible);

  const handleClose = useCallback(() => {
    document.body.classList.remove('overflow-hidden');
    preciseTimeout(() => {
      setOpen(false);
    }, 300);
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
    handleClose();
  }, [handleClose, setVisible]);

  const handleOpen = useCallback(() => {
    dialogRef.current?.showModal();
    if (dialogRef.current) {
      document.body.classList.add('overflow-hidden');
    }
  }, []);

  const addEventListener = useCallback(
    (options: AddEventListenerOptions) => {
      dialogRef.current?.addEventListener('cancel', handleCancel, options);
      dialogRef.current?.addEventListener('close', handleClose, options);
    },
    [handleCancel, handleClose],
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (visible) {
      requestAnimationFrame(() => {
        addEventListener({ once: true });
        handleOpen();
      });
    }

    return () => setMounted(false);
  }, [addEventListener, handleClose, handleOpen, setVisible, visible]);

  useEffect(() => {
    if (visible) {
      setOpen(true);
    } else {
      dialogRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    const abortCtrl = new AbortController();

    addEventListener({ signal: abortCtrl.signal });

    return () => {
      abortCtrl.abort();
    };
  }, [addEventListener, open]);

  useEffect(() => {
    if (open) {
      handleOpen();
    }
  }, [handleOpen, open]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      setVisible(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    mounted &&
    createPortal(
      <dialog
        ref={dialogRef}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 -translate-1/2 transition-discrete',
          'transition-discrete duration-300 not-open:transform-[scale(95%)] not-open:opacity-0 not-open:ease-out starting:open:opacity-0',
          'backdrop:fixed backdrop:inset-0 backdrop:bg-black/50 backdrop:backdrop-blur-xs backdrop:duration-300 not-open:backdrop:opacity-0 not-open:backdrop:ease-out open:backdrop:ease-in starting:open:backdrop:opacity-0',
          'bg-b2 rounded-md border border-white/10 bg-center px-6 py-4 max-md:min-w-xs md:rounded-xl md:py-8',
          className,
        )}
        onClick={handleBackdropClick}
        aria-modal="true">
        <section
          className={cn('flex flex-col items-center', bodyClassName)}
          onClick={(e) => {
            e.stopPropagation();
          }}>
          {rest.children}
        </section>
      </dialog>,
      document.body,
    )
  );
};

export default Modal;
