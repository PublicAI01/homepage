import type { UseEmblaCarouselType } from 'embla-carousel-react';
import React, {
  type ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from 'react';

type EmblaCarouselType = Exclude<UseEmblaCarouselType[1], undefined>;

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const id = requestAnimationFrame(() => {
      onInit(emblaApi);
      onSelect(emblaApi);
    });
    const handler = emblaApi
      .on('reInit', onInit)
      .on('reInit', onSelect)
      .on('select', onSelect);

    return () => {
      cancelAnimationFrame(id);
      handler.clear();
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

type PropType = ComponentPropsWithRef<'button'>;

export const DotButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return <button {...restProps}>{children}</button>;
};
