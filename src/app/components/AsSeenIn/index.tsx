import Image from 'next/image';
import Link from 'next/link';

import { BlogData } from '@/app/blog/type';
import styles from '@/app/components/AsSeenIn/AsSeenIn.module.css';
import AP from '@/assets/media-coverage/associated-press.png';
import BI from '@/assets/media-coverage/business-insider.png';
import MW from '@/assets/media-coverage/market-watch.png';
import YHF from '@/assets/media-coverage/yahoo-finance.png';
import { cn } from '@/utils';

const AsSeenIn = (
  props: Readonly<{ slugs: Required<BlogData['metadata']>['slugs'] }>,
) => {
  const [insider, yahoo, apnews, marketwatch] = props.slugs;

  return (
    <div className={cn(styles['as-seen-in-widget'], 'mx-auto mt-6 md:mt-10')}>
      <h3>As Seen In</h3>
      <div className={styles['as-seen-in-logos-container']}>
        <div className={styles['as-seen-in-logos']}>
          <div className={styles['as-seen-in-logo']}>
            <Link
              href={`https://markets.businessinsider.com/news/stocks/${insider}`}
              target="_blank"
              rel="noopener">
              <Image
                width={200}
                height={100}
                src={BI}
                alt="Markets Insider"
              />
            </Link>
          </div>
          <div className={styles['as-seen-in-logo']}>
            <Link
              href={`https://finance.yahoo.com/news/${yahoo}`}
              target="_blank"
              rel="noopener">
              <Image
                width={200}
                height={100}
                src={YHF}
                alt="Yahoo! Finance"
              />
            </Link>
          </div>
          <div className={styles['as-seen-in-logo']}>
            <Link
              href={`https://apnews.com/press-release/globenewswire-mobile/${apnews}`}
              target="_blank"
              rel="noopener">
              <Image
                width={200}
                height={100}
                src={AP}
                alt="Associated Press"
              />
            </Link>
          </div>
          <div className={styles['as-seen-in-logo']}>
            <Link
              href={`https://www.marketwatch.com/press-release/${marketwatch}?mod=search_headline`}
              target="_blank"
              rel="noopener">
              <Image
                width={200}
                height={100}
                src={MW}
                alt="MarketWatch"
              />
            </Link>
          </div>
        </div>
        <div className={styles['as-seen-in-rail right']}></div>
      </div>
    </div>
  );
};

export default AsSeenIn;
