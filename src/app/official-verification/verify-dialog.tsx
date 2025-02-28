'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { VerifyActionState } from '@/app/official-verification/verify-form';
import { cn } from '@/utils';

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
                className={cn(
                  'prose prose-sm prose-invert bg-b2 prose-a:text-white prose-li:marker:text-red-500 relative rounded-xl border border-white/10 bg-center px-6 py-4 text-center max-md:mx-4 md:py-8',
                  !isVerified &&
                    `[background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cGF0aCBmaWxsPSIjRkIyQzM2IiBmaWxsLW9wYWNpdHk9Ii4yIiBkPSJNMTguMTQ4Mzk4MiwxNS45OTExNDUyIEwyNS41NTYxOTgsOC41ODM5NTA3OCBDMjYuMTQ3MTI2Nyw3Ljk5MzAyMjA4IDI2LjE0NzEyNjcsNy4wMzQ1NzkzMiAyNS41NTYxOTgsNi40NDM2NTA2MiBDMjQuOTY0NjYzOSw1Ljg1MjExNjQ2IDI0LjAwNjgyNjYsNS44NTIxMTY0NiAyMy40MTU4OTc5LDYuNDQzNjUwNjIgTDE2LjAwODA5OCwxMy44NTA4NDUgTDguNjAwOTAzNjUsNi40NDM2NTA2MiBDOC4wMDk5NzQ5NSw1Ljg1MjExNjQ2IDcuMDUwOTI2NzMsNS44NTIxMTY0NiA2LjQ2MDYwMzQ5LDYuNDQzNjUwNjIgQzUuODY5MDY5MzMsNy4wMzQ1NzkzMiA1Ljg2OTA2OTMzLDcuOTkzMDIyMDggNi40NjA2MDM0OSw4LjU4Mzk1MDc4IEwxMy44Njc3OTc5LDE1Ljk5MTE0NTIgTDYuNDQzNjUwNjIsMjMuNDE1ODk3OSBDNS44NTIxMTY0NiwyNC4wMDc0MzIgNS44NTIxMTY0NiwyNC45NjUyNjkzIDYuNDQzNjUwNjIsMjUuNTU2MTk4IEM2LjczOTExNDk3LDI1Ljg1MTY2MjQgNy4xMjY2MDkyLDI1Ljk5OTM5NDUgNy41MTQxMDM0MywyNS45OTkzOTQ1IEM3LjkwMTU5NzY2LDI1Ljk5OTM5NDUgOC4yODkwOTE4OSwyNS44NTE2NjI0IDguNTg0NTU2MjQsMjUuNTU2MTk4IEwxNi4wMDg3MDM1LDE4LjEzMTQ0NTMgTDIzLjQxNTg5NzksMjUuNTM4NjM5NyBDMjMuNzExMzYyMiwyNS44MzQxMDQgMjQuMDk4ODU2NCwyNS45ODE4MzYyIDI0LjQ4NjM1MDcsMjUuOTgxODM2MiBDMjQuODczODQ0OSwyNS45ODE4MzYyIDI1LjI2MDczMzcsMjUuODM0MTA0IDI1LjU1NjgwMzUsMjUuNTM4NjM5NyBDMjYuMTQ3NzMyMiwyNC45NDcxMDU1IDI2LjE0NzczMjIsMjMuOTg5MjY4MiAyNS41NTY4MDM1LDIzLjM5ODMzOTUiLz48L3N2Zz4=')]`,
                )}
                onClick={(e) => e.stopPropagation()}>
                <h2>
                  {isVerified ? `Verified ${type}` : `Unverified ${type}`}
                </h2>
                <strong className="text-p1">
                  {props.state?.query ?? '--'}
                </strong>
                <h3
                  className={cn(
                    'mt-[0.8em] text-center text-lg',
                    isVerified ? 'text-green-500' : 'text-red-500',
                  )}>
                  {isVerified ? 'Verified Successfully✅' : 'Verified failed🚫'}
                </h3>
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
