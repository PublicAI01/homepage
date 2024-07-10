import styles from '@/app/products/sections/DataHunter/DataHunter.module.css';
import datasetIcon from '@/assets/svg/dataset-icon.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import trackingIcon from '@/assets/svg/tracking-icon.svg?react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const DataHunter = () => {
  return (
    <SectionWrapper
      className="lg:mt-40"
      title="Data Hunter"
      anchorId="hunter">
      <h3 className="mt-7 text-center text-base font-medium text-g1 md:text-lg">
        Data Hunter empowers users to instantly contribute valuable data and
        earn rewards{' '}
        <b
          className={cn(styles.typing, 'mx-auto mt-3 block font-bold text-p1')}>
          with a simple click.
        </b>
      </h3>

      <section className="mt-10 flex w-full flex-col items-center gap-2 md:mt-20 md:flex-row">
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

export default DataHunter;
