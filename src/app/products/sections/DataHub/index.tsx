import clsx from 'clsx';

import styles from '@/app/products/sections/DataHub/DataHub.module.css';
import datasetIcon from '@/assets/svg/dataset-icon.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import votingIcon from '@/assets/svg/voting-icon.svg?react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';

const DataHub = () => {
  return (
    <SectionWrapper
      className="lg:mt-40"
      title="Data Hub">
      <h3 className="mt-7 text-center text-xs font-medium text-g1 md:text-lg">
        Data Hub empowers users to earn tokens by validating datasets,{' '}
        <b className={clsx(styles.typing, 'mx-auto block font-bold text-p1')}>
          fostering a decentralized Train-AI-To-Earn ecosystem.
        </b>
      </h3>

      <section className="mt-10 flex w-full flex-col items-center gap-2 md:mt-20 md:flex-row">
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
          <Card
            key={index}
            className="flex-1 self-stretch"
            title={item.title}
            content={item.content}>
            {<item.Icon />}
          </Card>
        ))}
      </section>
    </SectionWrapper>
  );
};

export default DataHub;
