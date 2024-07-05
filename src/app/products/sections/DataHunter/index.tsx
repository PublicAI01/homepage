'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from '@/app/products/sections/DataHunter/DataHunter.module.css';
import datasetIcon from '@/assets/svg/dataset-icon.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import trackingIcon from '@/assets/svg/tracking-icon.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';

const DataHunter = () => {
  return (
    <SectionWrapper
      className="lg:mt-40"
      title="Data Hunter">
      <h3 className="text-g1 mt-7 text-base font-medium text-center md:text-lg">
        Data Hunter empowers users to instantly contribute valuable data and
        earn rewards{' '}
        <b className={clsx(styles.typing, 'font-bold text-p1 block mx-auto')}>
          with a simple click.
        </b>
      </h3>

      <section className="flex flex-col items-center gap-2 mt-10 md:flex-row md:mt-20">
        {[
          {
            Icon: datasetIcon,
            title: 'Seamless Data Collection',
            content:
              'Collect high-quality data from social media and ChatGPT conversation with a click of a button.',
          },
          {
            Icon: rewardIcon,
            title: 'Instant Reward System',
            content:
              'Earn $PUBLIC tokens on the spot for every approved data upload.',
          },
          {
            Icon: trackingIcon,
            title: 'Real-Time Contribution Tracking',
            content:
              'Monitor the progress and impact of your uploads in real-time.',
          },
        ].map((item, index) => (
          <article
            key={index}
            className={clsx(
              cardStyles.card,
              'border rounded-xl flex-1 bg-b2 transition-colors border-white hover:bg-white p-4 lg:p-7 self-stretch',
            )}
            style={
              {
                '--duration': '0.4',
              } as CSSProperties
            }
            onMouseEnter={(e) => {
              e.currentTarget.classList.remove('animate-card-flicker');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.add('animate-card-flicker');
            }}>
            <item.Icon className="size-9 lg:size-11" />
            <h4 className="my-2 text-base font-bold transition-colors lg:my-4 lg:text-xl">
              {item.title}
            </h4>
            <p className="text-xs font-medium transition-colors">
              {item.content}
            </p>
          </article>
        ))}
      </section>
    </SectionWrapper>
  );
};

export default DataHunter;
