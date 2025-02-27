'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { VerifyActionState } from '@/app/official-verification/verify-form';

interface VerifyDialogProps extends React.ComponentProps<'dialog'> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  state?: VerifyActionState;
}

const VerifyDialog = (props: VerifyDialogProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted && props.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mounted, props.isOpen]);

  const isVerified = props.state?.result ?? false;
  const type = props.state?.type ?? '--';

  return (
    <>
      {mounted &&
        props.isOpen &&
        createPortal(
          <>
            <dialog
              className="fixed inset-x-0 top-0 z-100 flex h-screen w-full cursor-pointer items-center justify-center bg-black/10 backdrop-blur-xs"
              open
              onClick={() => {
                props.setIsOpen(false);
              }}>
              <div
                className="prose prose-sm prose-invert bg-b2 prose-a:text-white prose-li:marker:text-red-500 rounded-xl border border-white/10 px-6 py-4 text-center max-md:mx-4"
                onClick={(e) => e.stopPropagation()}>
                <h2>
                  {isVerified ? `Verified ${type}` : `Unverified ${type}`}
                </h2>
                <strong className="text-p1">
                  {props.state?.query ?? '--'}
                </strong>
                <p>
                  {isVerified
                    ? `The source you entered is an official ${type} from PublicAI`
                    : `The source you entered is not an official ${type} from PublicAI. Please check that you have chosen the correct query type, as incorrect tags will affect verification results.`}
                </p>
                <button
                  className="bg-primary w-full cursor-pointer rounded-sm px-6 py-3 text-base text-white"
                  onClick={() => {
                    props.setIsOpen(false);
                  }}>
                  Ok
                </button>
              </div>
            </dialog>
          </>,
          document.body,
        )}
    </>
  );
};

export default VerifyDialog;
