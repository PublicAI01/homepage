import Image from 'next/image';

import berachain from '@/assets/image/berachain.png';
import bnbChain from '@/assets/image/bnb-chain.png';
import ton from '@/assets/image/ton.png';
import AIProfessor from '@/assets/svg/ai-professor.svg?react';
import AirdropAssistant from '@/assets/svg/airdrop.svg?react';
import kLineTrader from '@/assets/svg/k-line.svg?react';
import OnChainExpert from '@/assets/svg/on-chain.svg?react';
import XTrendAnalyst from '@/assets/svg/twitter.svg?react';
import SectionWrapper from '@/components/SectionWrapper';

const Showcase = () => {
  return (
    <SectionWrapper
      className="bg-b3 py-7 lg:py-14 lg:mt-40"
      title="Showcase"
      useMobileContainerWidth={false}>
      <section>
        <h3 className="mt-14 text-xl font-bold text-center text-white lg:text-3xl">
          AI Agents for Public Blockchains
        </h3>
        <h5 className="mb-5 lg:mb-10 text-base lg:text-lg font-medium text-center text-white mt-7 lg:px-[20%] px-4">
          We offer data services for various public blockchain networks,
          empowering them to create Custom AI Agents capable of executing
          diverse tasks from data analysis to automated decision-making.
        </h5>
        <div className="container flex flex-wrap justify-center items-center gap-6 2xl:gap-20 lg:gap-10 xl:gap-14">
          {[
            { image: berachain, name: 'berachain' },
            { image: ton, name: 'TON' },
            { image: bnbChain, name: 'BNB chain' },
          ].map((item, index) => (
            <article
              key={index}
              className="frosted-card py-2.5 px-3 rounded-xl">
              <Image
                className="w-auto h-9 md:h-11"
                src={item.image}
                alt={item.name}
              />
            </article>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mt-16 text-xl font-bold text-center text-white lg:mt-32 lg:text-3xl">
          Empowerment for AI Developers
        </h3>
        <h5 className="mb-5 lg:mb-10 text-base lg:text-lg font-medium text-center text-white mt-7 lg:px-[20%] px-4">
          Empower AI developers with the tools necessary to simplify the
          creation, deployment, and customization of AI Agents, streamlining the
          development process.
        </h5>
        <div className="flex flex-wrap justify-center items-center gap-6 2xl:gap-20 lg:gap-10 xl:gap-14">
          {[
            { Icon: AirdropAssistant, name: 'Airdrop Assistant' },
            { Icon: kLineTrader, name: 'K-Line Trader' },
            { Icon: AIProfessor, name: 'AI Professor' },
            { Icon: OnChainExpert, name: 'On-chain Expert' },
            { Icon: XTrendAnalyst, name: 'X Trend Analyst' },
          ].map((item, index) => (
            <article
              key={index}
              className="flex flex-col items-center text-white">
              <div className="frosted-card p-4 rounded border">
                <item.Icon className="size-8 md:size-10" />
              </div>
              <p className="mt-4 text-lg font-semibold sm:text-base">
                {item.name}
              </p>
            </article>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Showcase;
