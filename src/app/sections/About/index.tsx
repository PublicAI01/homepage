import { YouTubeEmbed } from '@next/third-parties/google';

import DataPanel from '@/app/sections/DataPanel';
import competitiveWorkforce from '@/assets/svg/builder-icon.svg?react';
import costEfficiency from '@/assets/svg/cost-efficiency.svg?react';
import mutualModalData from '@/assets/svg/mutual-modal-data.svg?react';
import qualityControl from '@/assets/svg/quality-control.svg?react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';

const About = () => {
  return (
    <SectionWrapper
      className="[&>[data-ntpc]]:w-full!"
      title="Why PublicAI"
      marginTop={false}>
      <h3 className="text-g1 container mt-12 text-center text-base font-medium md:text-2xl">
        PublicAI - AI data infra: open to every human contributing data to train
        AI and sharing the revenue. The team includes world-class AI scientists,
        IEEE fellows, professors, and PhDs. Mission is to monetize all human
        knowledge to train Public AGI.
      </h3>
      <YouTubeEmbed
        {...{
          class:
            'w-full h-auto max-w-none! rounded-xl mt-12 overflow-hidden bg-b3 lg:mt-16 lg:h-150',
        }}
        videoid="i0U8uaUrILs"
      />
      <DataPanel />
      <div className="container mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-4 lg:mt-20 lg:grid-cols-3 xl:grid-cols-4">
        {[
          {
            Icon: competitiveWorkforce,
            title: 'Competitive Workforce',
            content:
              'Access the best talent from around the world without the barriers of international banking and central platforms.',
          },
          {
            Icon: qualityControl,
            title: 'Quality Control',
            content:
              'Ensure smooth dataset delivery using on-chain staking systems. Leveraging access tests and SBT to verify the capabilities of Validators in specialized data annotation fields.',
          },
          {
            Icon: costEfficiency,
            title: 'Cost Efficiency',
            content:
              "Reduced work and cost redundancy with PublicAI's on-chain staking and liability mechanisms, outperforming traditional platforms.",
          },
          {
            Icon: mutualModalData,
            title: 'Mutual Modal Data',
            content:
              "We provide the world's largest decentralized platform for collecting and annotating multi-modal data, including text, audio, video, and mapping data.",
          },
        ].map((item, index) => (
          <Card
            key={index}
            title={item.title}
            content={item.content}>
            <item.Icon />
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default About;
