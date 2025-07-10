'use client';

import Image, { type StaticImageData } from 'next/image';

import EmblaCarousel from '@/app/components/EmblaCarousel';
import { cn, shimmer, toBase64 } from '@/utils';

interface SwiperCardProps extends React.ComponentProps<'div'> {
  title: string;
  subTitle: string;
  content: string;
  images: StaticImageData[];
  imageAltPrefix: string;
}

const SwiperCard = (props: SwiperCardProps) => {
  const {
    className,
    title,
    subTitle,
    content,
    images,
    imageAltPrefix,
    ...rest
  } = props;
  return (
    <div
      className={cn(
        'bg-b3/65 container mx-auto flex flex-col justify-between self-stretch rounded-2xl border border-white px-4 pt-5 pb-8 max-md:w-[calc(100vw-calc(var(--spacing-mobile-padding-x)*2))] lg:p-6 lg:pb-10',
        className,
      )}
      {...rest}>
      <hgroup className="md:mx-auto md:w-3/5">
        <h3 className="text-base font-semibold text-white md:font-bold lg:text-2xl">
          {title}
        </h3>
        <h4 className="text-base font-semibold text-white md:font-bold lg:text-2xl">
          {subTitle}
        </h4>
        <p className="text-g1 my-3 text-sm font-medium lg:text-base">
          {content}
        </p>
      </hgroup>
      <EmblaCarousel
        className="md:mx-auto md:w-3/5"
        slides={images}
        slideBuilder={(item, index) => (
          <Image
            className="border-b4 h-auto w-full rounded-xl border"
            src={item}
            height={640}
            placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(960, 640))}`}
            alt={`${imageAltPrefix} ${index + 1}`}
          />
        )}
      />
    </div>
  );
};

export default SwiperCard;
