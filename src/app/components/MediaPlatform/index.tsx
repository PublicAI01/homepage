import Link from 'next/link';

import headerStyles from '@/app/components/Header/Header.module.css';
import styles from '@/app/components/MediaPlatform/MediaPlatform.module.css';
import { PLATFORMS } from '@/constant/platforms';
import { cn } from '@/utils';

const MediaPlatform = () => {
  return (
    <aside
      className={cn(
        'fixed top-[50vh] right-1 z-50 flex flex-col gap-4 md:right-5',
        headerStyles['side-media-platform'],
      )}>
      {PLATFORMS.map((item, index) => (
        <Link
          key={index}
          className={cn(
            styles.platform,
            'relative transition-transform md:hover:scale-150',
          )}
          href={item.link}
          target="_blank"
          rel="external noreferrer"
          aria-label={`${item.label} link`}>
          <item.Icon className="text-g1 size-8 rounded-full transition-colors hover:text-white md:size-9" />
          <p className="text-g1 absolute top-1/2 -left-2 -translate-x-full -translate-y-1/2 text-lg leading-6 md:text-xl md:leading-9">
            {item.label}
          </p>
        </Link>
      ))}
    </aside>
  );
};

export default MediaPlatform;
