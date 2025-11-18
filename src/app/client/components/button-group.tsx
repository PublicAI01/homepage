'use client';

import { sendGAEvent } from '@next/third-parties/google';

import Button from '@/components/Button';
import { BUSINESS_LINK } from '@/constant';
import { cn } from '@/utils';

function ButtonGroup() {
  return (
    <>
      <Button
        className={cn(
          'w-fit text-xs',
          'px-3 py-2 xl:px-3.5 xl:py-2.5 2xl:px-4 2xl:py-3',
        )}
        theme="primary"
        href={BUSINESS_LINK}
        target="_blank"
        aria-label="fill in the business cooperation form"
        onClick={() => {
          sendGAEvent('event', 'buttonClicked', {
            button_name: 'Connect with our AI experts',
            screen_name: 'homepage/client',
          });
        }}>
        Connect with our AI experts
      </Button>
      <Button
        className={cn(
          'w-fit text-xs',
          'px-3 py-2 xl:px-3.5 xl:py-2.5 2xl:px-4 2xl:py-3',
        )}
        target="_blank"
        href="/business.pdf"
        aria-label="to business pdf"
        onClick={() => {
          sendGAEvent('event', 'buttonClicked', {
            button_name: 'Power Your AI',
            screen_name: 'homepage/client',
          });
        }}>
        Power Your AI
      </Button>
    </>
  );
}

export default ButtonGroup;
