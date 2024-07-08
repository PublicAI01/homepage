import clsx from 'clsx';
import Link from 'next/link';

import headerStyles from '@/app/components/Header/Header.module.css';
import styles from '@/app/components/MediaPlatform/MediaPlatform.module.css';
import { PLATFORMS } from '@/constant/platforms';

const MediaPlatform = () => {
  return (
    <aside
      className={clsx(
        'fixed right-1 top-[50vh] z-50 flex flex-col gap-4 md:right-5',
        headerStyles['side-media-platform'],
      )}>
      {PLATFORMS.map((item, index) => (
        <Link
          key={index}
          className={clsx(
            styles.platform,
            'relative transition-transform md:hover:scale-150',
          )}
          href={item.link}
          target="_blank"
          rel="external noreferrer"
          aria-label={`${item.label} link`}>
          <item.Icon className="size-8 rounded-full text-g1 transition-colors hover:text-white md:size-9" />
          <p className="absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 text-2xl leading-6 text-g1 md:text-4xl md:leading-9">
            {item.label}
          </p>
        </Link>
      ))}
    </aside>
  );
};

export default MediaPlatform;
