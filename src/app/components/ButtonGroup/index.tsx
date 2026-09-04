'use client';

import { sendGAEvent } from '@next/third-parties/google';

import Button from '@/components/Button';
import { cn } from '@/utils';

interface ButtonGroupProps extends React.ComponentProps<'div'> {}

const ButtonGroup = (props: ButtonGroupProps) => {
  const { className, ...rest } = props;
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-5 md:gap-8 xl:flex-row xl:gap-5',
        className,
      )}
      {...rest}>
      <Button
        className="w-auto px-3 shadow-none"
        href="/business"
        aria-label="request a pilot"
        onClick={() => {
          sendGAEvent('event', 'buttonClicked', {
            button_name: 'Request a pilot',
            screen_name: 'homepage/header',
          });
        }}>
        Request a pilot
      </Button>
    </div>
  );
};

export default ButtonGroup;
