import type { FC, SVGProps } from 'react';

import styles from '@/app/products/sections/PublicAIArena/PublicAIArena.module.css';
import chatBox from '@/assets/svg/chat-box.svg?react';
import computer from '@/assets/svg/computer.svg?react';
import rewardIcon from '@/assets/svg/reward-icon.svg?react';
import todoCheck from '@/assets/svg/todo-check.svg?react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const PublicAIArena = () => {
  return (
    <SectionWrapper
      className="!w-full !max-w-full lg:mt-40"
      title="PublicAI Arena"
      anchorId="arena"
      useMobileContainerWidth={false}>
      <h3 className="mt-7 text-center text-xs font-medium text-g1 md:text-lg">
        PublicAI Arena empowers a global community of AI enthusiasts to enhance
        AI models and earn rewards through{' '}
        <b
          className={cn(styles.typing, 'mx-auto mt-3 block font-bold text-p1')}>
          interactive validation and data contribution.
        </b>
      </h3>

      <section className="mt-10 flex w-full flex-col gap-6 bg-b3 py-4 max-md:px-4 md:mt-20 md:gap-9 lg:pb-24 lg:pt-9">
        <Panel
          title="PublicAI Arena - Chat"
          subTitle="Interactive AI Model Comparison & Evaluation"
          desc="Instantly engage with multiple AI models to compare responses and rank their quality, earning points for your evaluations."
          cards={[
            {
              Icon: chatBox,
              title: 'One-Click Questioning',
              content:
                'Pose your questions to various AI models with a single click, receiving diverse and comparative answers.',
            },
            {
              Icon: rewardIcon,
              title: 'Ranking and Rewards',
              content:
                'Earn points by ranking AI responses through a simple drag-and-drop interface, contributing to the collective intelligence of AI models.',
            },
          ]}
        />
        <Panel
          title="PublicAI Arena - Data"
          subTitle="Decentralized AI Data Contribution"
          desc="Contribute to the training of AI models by providing private domain data, and receive cryptocurrency rewards for your contributions."
          cards={[
            {
              Icon: computer,
              title: 'Effortless Data Contribution',
              content:
                'Share private domain data from Telegram channels and other sources with ease, enhancing AI learning.',
            },
            {
              Icon: todoCheck,
              title: 'Consensus-Based Validation',
              content:
                'Participate in validating data accuracy and quality, refining AI models, and earn $PUBLIC tokens for your contributions.',
            },
          ]}
        />
      </section>
    </SectionWrapper>
  );
};

interface CardItem {
  Icon: FC<SVGProps<SVGElement>>;
  title: string;
  content: string;
}

const Panel: FC<{
  className?: string;
  title: string;
  subTitle: string;
  desc: string;
  cards: CardItem[];
}> = ({ className, title, subTitle, desc, cards }) => {
  return (
    <section
      className={cn('container mx-auto flex flex-col items-center', className)}>
      <h4 className="mb-2 text-xl font-semibold text-p1 md:text-3xl lg:mb-7">
        {title}
      </h4>
      <h5 className="text-center text-xs font-normal text-white md:text-xl">
        {subTitle}
      </h5>
      <h6 className="text-center text-xs font-normal text-g3 md:text-xl md:text-white">
        {desc}
      </h6>
      <div className="mt-5 flex w-full flex-col items-center gap-2 md:mt-10 md:flex-row">
        {cards.map((item, index) => (
          <Card
            key={index}
            className="flex-1 self-stretch"
            title={item.title}
            content={item.content}>
            {<item.Icon />}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PublicAIArena;
