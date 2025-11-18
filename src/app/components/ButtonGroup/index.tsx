'use client';

import { sendGAEvent } from '@next/third-parties/google';

import Button from '@/components/Button';
import { BUSINESS_LINK } from '@/constant';
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
        href={BUSINESS_LINK}
        aria-label="fill in the business cooperation form"
        onClick={() => {
          sendGAEvent('event', 'buttonClicked', {
            button_name: 'Book a Demo',
            screen_name: 'homepage/header',
          });
        }}>
        Book a Demo
      </Button>
    </div>
  );
};

export default ButtonGroup;
