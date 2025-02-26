import type { UseEmblaCarouselType } from 'embla-carousel-react';
import React, {
  type ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from 'react';

import Left from '@/assets/svg/arrow-left.svg?react';
import Right from '@/assets/svg/arrow-right.svg?react';
import { cn } from '@/utils';

type EmblaCarouselType = Exclude<UseEmblaCarouselType[1], undefined>;

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropType = ComponentPropsWithRef<'button'>;

const buttonClassName =
  'flex size-7 p-1 md:size-8 md:p-1.5 lg:size-9 xl:size-10 2xl:size-11 3xl:size-12 cursor-pointer touch-manipulation appearance-none items-center justify-center rounded-full bg-[#d9d9d9]/24 text-white disabled:cursor-not-allowed disabled:text-white/50 backdrop-blur-xs';

export const PrevButton = (props: PropType) => {
  const { className, children, ...restProps } = props;

  return (
    <button
      className={cn(buttonClassName, className)}
      type="button"
      {...restProps}>
      <Left aria-hidden />
      <span className="visually-hidden">Previous</span>
      {children}
    </button>
  );
};

export const NextButton = (props: PropType) => {
  const { className, children, ...restProps } = props;

  return (
    <button
      className={cn(buttonClassName, className)}
      type="button"
      {...restProps}>
      <Right aria-hidden />
      <span className="visually-hidden">Next</span>
      {children}
    </button>
  );
};
