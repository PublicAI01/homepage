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
      <h3 className="text-g1 mt-7 text-xs font-medium text-center md:text-lg">
        Data Hub empowers users to earn tokens by validating datasets,{' '}
        <b className={clsx(styles.typing, 'font-bold text-p1 block mx-auto')}>
          fostering a decentralized Train-AI-To-Earn ecosystem.
        </b>
      </h3>

      <section className="w-full flex flex-col items-center gap-2 mt-10 md:flex-row md:mt-20">
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
