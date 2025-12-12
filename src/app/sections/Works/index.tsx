import Image from 'next/image';

import styles from '@/app/sections/Works/Works.module.css';
import arrowToLeft from '@/assets/image/arrow-to-left.svg';
import arrowToRight from '@/assets/image/arrow-to-right.svg';
import publicaiOutlined from '@/assets/image/publicai-outlined.svg';
import requesters from '@/assets/image/requesters.svg';
import workers from '@/assets/image/workers.svg';
import DataCollection from '@/assets/svg/data-collection.svg?react';
import DataLabeling from '@/assets/svg/data-labeling.svg?react';
import ModelEvaluation from '@/assets/svg/model-evaluation.svg?react';
import Button from '@/components/Button';
import { Card2 } from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import { PUBLIC_AI_DATA_HUB_LINK } from '@/constant';
import { cn } from '@/utils';

const Works = () => {
  return (
    <SectionWrapper
      className="bg-black py-6 max-md:px-4"
      title="How it works"
      useMobileContainerWidth={false}>
      <section className="my-16 flex flex-col justify-between max-md:mt-12 max-md:mb-6 md:flex-row md:items-center">
        <_Block
          className="flex-1"
          image={requesters}
          content="Clients make requests for specialized, on-demand data"
          link={{
            children: 'Request Data',
            href: '/business.pdf',
            'aria-label': 'to business pdf',
          }}
        />
        <div className="flex h-6 w-20 max-md:mt-14 max-md:mb-14 max-md:ml-2.5 max-md:rotate-90 md:h-10 md:w-28 md:-translate-y-[150%]">
          <Image
            className={styles['arrow-animate']}
            src={arrowToRight}
            width={112}
            height={40}
            alt="arrow to right"
          />
        </div>
        <_Block
          className="flex-1"
          image={publicaiOutlined}
          content="PublicAI Marketplace"
        />
        <div className="flex h-6 w-20 justify-end max-md:mt-14 max-md:mb-14 max-md:ml-2.5 max-md:rotate-90 md:h-10 md:w-28 md:-translate-y-[150%]">
          <Image
            className={styles['arrow-animate']}
            src={arrowToLeft}
            width={112}
            height={40}
            alt="arrow to left"
          />
        </div>
        <_Block
          className="flex-1"
          image={workers}
          content="Community earns rewards by working on interesting tasks"
          link={{
            children: 'Earn on Data Hub',
            href: PUBLIC_AI_DATA_HUB_LINK,
            'aria-label': 'to data hub website',
          }}
        />
      </section>

      <section className="3xl:px-40 my-6 grid w-full grid-cols-1 gap-6 md:my-15 md:grid-cols-3 md:px-8 lg:gap-9 lg:px-16 xl:gap-12 xl:px-24 2xl:gap-15 2xl:px-32">
        {[
          {
            Icon: DataCollection,
            title: 'Data Collection',
            content:
              'AI Builders source and curate high-quality content from social media. Contribute social media and GPT conversation content using the Data Hunter plugin.',
          },
          {
            Icon: DataLabeling,
            title: 'Data Labeling',
            content:
              'Deliver high-quality, cost-effective data labeling through an AI-assisted workflow: AI Assistants pre-label data, followed by thorough verification by AI Validators.',
          },
          {
            Icon: ModelEvaluation,
            title: 'Model Evaluation',
            content:
              "Analyze your AI models' performance: explore model metrics, identify weaknesses, and evaluate models using scenario tests.",
          },
        ].map((item, index) => (
          <Card2
            key={index}
            title={item.title}
            content={item.content}>
            <item.Icon className="mt-7.5 h-auto w-18 self-end text-white" />
          </Card2>
        ))}
      </section>
    </SectionWrapper>
  );
};

interface _BlockProps extends React.ComponentProps<'div'> {
  image: string;
  content: string;
  link?: Pick<
    React.ComponentProps<typeof Button>,
    'href' | 'children' | 'aria-label'
  >;
}

const _Block = (props: _BlockProps) => {
  const { className, image, content, link, ...rest } = props;

  return (
    <div
      className={cn(
        'flex w-full items-center gap-1.5 self-stretch max-md:px-4 md:flex-col',
        className,
      )}
      {...rest}>
      <Image
        className="h-auto w-16 md:w-28"
        src={image}
        width={112}
        alt={content.toLocaleLowerCase()}
      />
      <div className="flex flex-col items-center max-md:gap-1">
        <p className="mb-1 text-base text-white max-md:ml-4 md:mt-8 md:mb-2 md:w-3/4 md:text-center">
          {content}
        </p>
        {link && (
          <Button
            className="w-fit px-4 shadow-none after:z-0"
            {...link}>
            <span className="relative z-1">{link.children}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Works;
