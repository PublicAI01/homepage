import styles from '@/app/datahunter/sections/DataHunter/DataHunter.module.css';
import datasetIcon from '@/assets/svg/dataset-icon.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import trackingIcon from '@/assets/svg/tracking-icon.svg?react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const DataHunter = () => {
  return (
    <SectionWrapper className="mt-5 lg:mt-10">
      <h3 className="text-g1 text-center text-xs font-medium md:text-lg">
        Data Hunter empowers users to instantly contribute valuable data and
        earn rewards{' '}
        <b
          className={cn(styles.typing, 'text-p1 mx-auto mt-3 block font-bold')}>
          with a simple click.
        </b>
      </h3>

      <section className="mt-10 flex w-full flex-col items-center gap-2 md:mt-20 md:flex-row">
        {[
          {
            Icon: datasetIcon,
            title: 'Effortless AI Contribution',
            content:
              'This seamless Chrome extension lets you contribute to AI development effortlessly—just log in with your PublicAI Data Hub account and start earning.',
          },
          {
            Icon: rewardIcon,
            title: 'Engage or Earn Passively',
            content:
              'Reply to high-quality tweets on X using the AI Reply feature, or passively collect points by keeping your browser open. ',
          },
          {
            Icon: trackingIcon,
            title: 'Monitor Your Impact',
            content:
              'Track your daily gains in the Data Hub Dashboard and watch your impact grow.',
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
