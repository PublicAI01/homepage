import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import Image, { type StaticImageData } from 'next/image';
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
import { cn, shimmer, toBase64 } from '@/utils';

type EmblaOptionsType = Exclude<
  Parameters<typeof useEmblaCarousel>[0],
  undefined
>;

interface EmblaCarouselProps extends React.ComponentProps<'section'> {
  slides: StaticImageData[];
  options?: EmblaOptionsType;
  imageAltPrefix: string;
}

const EmblaCarousel = (props: EmblaCarouselProps) => {
  const { className, slides, options, imageAltPrefix } = props;
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
    <section className={cn('relative', className)}>
      <div
        className="overflow-hidden rounded-xl [--carousel-gap:calc(var(--spacing)*4)] md:[--carousel-gap:calc(var(--spacing)*5)]"
        ref={emblaRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="carousel">
        <div className="-ml-[var(--carousel-gap)] flex [touch-action:pan-y_pinch-zoom] items-center">
          {slides.map((item, index) => (
            <div
              className="min-w-0 flex-[0_0_100%] pl-[var(--carousel-gap)] will-change-scroll"
              key={index}>
              <Image
                className="border-b4 h-auto w-full rounded-xl border"
                src={item}
                height={640}
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(960, 640))}`}
                alt={`${imageAltPrefix} ${index + 1}`}
              />
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

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-full flex-wrap items-center justify-center gap-2 pt-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={cn(
              'size-2.5 cursor-pointer touch-manipulation appearance-none rounded-full bg-[#515151] md:size-3',
              index === selectedIndex && 'bg-[#d9d9d9]',
            )}
            aria-label={`picture ${index + 1}`}
            aria-current={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default EmblaCarousel;
