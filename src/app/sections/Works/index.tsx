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
          comingSoon="Earn on Trajector"
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
  comingSoon?: string;
}

const _Block = (props: _BlockProps) => {
  const { className, image, content, link, comingSoon, ...rest } = props;

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
        {comingSoon ? (
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-fit cursor-not-allowed rounded-sm bg-[#4808FE]/40 px-4 py-2 text-base font-medium text-white/60 shadow-[0.125rem_0.125rem_0_0] shadow-white/30 select-none">
              {comingSoon}
            </button>
            <span className="bg-primary/20 text-p1 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold whitespace-nowrap uppercase">
              Coming soon
            </span>
          </div>
        ) : (
          link && (
            <Button
              className="w-fit px-4 shadow-none after:z-0"
              {...link}>
              <span className="relative z-1">{link.children}</span>
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default Works;
