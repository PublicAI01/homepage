'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from '@/app/products/sections/DataHub/DataHub.module.css';
import datasetIcon from '@/assets/svg/dataset-icon.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import votingIcon from '@/assets/svg/voting-icon.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';

const DataHub = () => {
  return (
    <SectionWrapper
      className="lg:mt-40"
      title="Data Hub">
      <h3 className="text-g1 mt-7 text-sm font-medium text-center md:text-lg">
        Data Hub empowers users to earn tokens by validating datasets,{' '}
        <b className={clsx(styles.typing, 'font-bold text-p1 block mx-auto')}>
          fostering a decentralized Train-AI-To-Earn ecosystem.
        </b>
      </h3>

      <section className="flex flex-col items-center gap-2 mt-10 md:flex-row md:mt-20">
        {[
          {
            Icon: datasetIcon,
            title: 'Dataset Selection',
            content:
              'Choose from a variety of datasets to validate, tailored to your expertise.',
          },
          {
            Icon: votingIcon,
            title: 'MCQ Quiz Voting',
            content:
              'Contribute to AI training by answering multiple-choice questions on data authenticity.',
          },
          {
            Icon: rewardIcon,
            title: 'Consensus Rewards',
            content:
              'Earn $PUBLIC tokens when your responses align with the majority consensus.',
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

export default DataHub;
