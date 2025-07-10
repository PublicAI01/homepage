import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import React from 'react';

import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from '@/app/components/EmblaCarousel/EmblaCarouselArrowButtons';
import {
  DotButton,
  useDotButton,
} from '@/app/components/EmblaCarousel/EmblaCarouselDotButton';
import { cn } from '@/utils';

type EmblaOptionsType = Exclude<
  Parameters<typeof useEmblaCarousel>[0],
  undefined
>;

interface EmblaCarouselProps<T> extends React.ComponentProps<'section'> {
  options?: EmblaOptionsType;
  slides: T[];
  slideClassName?: string;
  slideBuilder: (item: T, index: number) => React.ReactNode;
}

const EmblaCarousel = <T,>(props: EmblaCarouselProps<T>) => {
  const { className, options, slides, slideClassName, slideBuilder, ...rest } =
    props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    WheelGesturesPlugin(),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section
      className={cn('relative', className)}
      {...rest}>
      <div
        className="overflow-hidden rounded-xl [--carousel-gap:calc(var(--spacing)*4)] md:[--carousel-gap:calc(var(--spacing)*5)]"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="carousel">
        <div className="-ml-[var(--carousel-gap)] flex [touch-action:pan-y_pinch-zoom] items-center">
          {slides.map((item, index) => (
            <div
              className={cn(
                'min-w-0 flex-[0_0_100%] pl-[var(--carousel-gap)] will-change-scroll',
                slideClassName,
              )}
              key={index}>
              {slideBuilder(item, index)}
            </div>
          ))}
        </div>
      </div>

      <PrevButton
        className="absolute top-1/2 left-0 -translate-x-[150%] -translate-y-1/2 max-md:hidden"
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
        aria-label="previous picture"
      />
      <NextButton
        className="absolute top-1/2 right-0 translate-x-[150%] -translate-y-1/2 max-md:hidden"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        aria-label="next picture"
      />

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-full flex-wrap items-center justify-center pt-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className="cursor-pointer touch-manipulation appearance-none p-1"
            aria-label={`picture ${index + 1}`}
            aria-current={index === selectedIndex}>
            <div
              className={cn(
                'size-2.5 rounded-full bg-[#515151] md:size-3',
                index === selectedIndex && 'bg-[#d9d9d9]',
              )}></div>
          </DotButton>
        ))}
      </div>
    </section>
  );
};

export default EmblaCarousel;
