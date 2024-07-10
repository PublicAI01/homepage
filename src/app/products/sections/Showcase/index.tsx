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
import { cn } from '@/utils';

const Showcase = () => {
  return (
    <SectionWrapper
      className="bg-b3 py-7 lg:mt-40 lg:py-14"
      title="Showcase"
      anchorId="showcase"
      useMobileContainerWidth={false}>
      <section>
        <h3 className="mt-14 text-center text-xl font-bold text-white lg:text-3xl">
          AI Agents for Public Blockchains
        </h3>
        <h4 className="mb-5 mt-7 px-4 text-center text-base font-medium text-white lg:mb-10 lg:px-[20%] lg:text-lg">
          We offer data services for various public blockchain networks,
          empowering them to create Custom AI Agents capable of executing
          diverse tasks from data analysis to automated decision-making.
        </h4>
        <div className="container flex flex-wrap items-center justify-center gap-6 lg:gap-10 xl:gap-14 2xl:gap-20">
          {[
            { image: berachain, name: 'berachain' },
            { image: ton, name: 'TON' },
            { image: bnbChain, name: 'BNB chain' },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/5 bg-gradient-to-br from-white/15 to-black/5 px-3 py-2.5 backdrop-blur">
              <Image
                className="h-9 w-auto md:h-11"
                src={item.image}
                height={44}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="mt-16 text-center text-xl font-bold text-white lg:mt-32 lg:text-3xl">
          Empowerment for AI Developers
        </h3>
        <h4 className="mb-10 mt-7 px-4 text-center text-base font-medium text-white lg:px-[20%] lg:text-lg">
          Empower AI developers with the tools necessary to simplify the
          creation, deployment, and customization of AI Agents, streamlining the
          development process.
        </h4>
        <div className="mx-auto flex flex-wrap items-center justify-center gap-8 max-sm:w-4/5 lg:gap-10 xl:gap-14 2xl:gap-20">
          {[
            { Icon: AirdropAssistant, name: 'Airdrop Assistant' },
            { Icon: kLineTrader, name: 'Crypto Trader' },
            { Icon: AIProfessor, name: 'AI Professor' },
            { Icon: OnChainExpert, name: 'On-chain Expert' },
            { Icon: XTrendAnalyst, name: 'X Trend Analyst' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-white">
              <div className="rounded border border-white/5 bg-gradient-to-br from-white/15 to-black/5 p-4 backdrop-blur">
                <item.Icon
                  className={cn(
                    'size-8 md:size-10',
                    item.Icon.name === XTrendAnalyst.name && 'scale-75',
                  )}
                />
              </div>
              <p className="mt-4 text-center text-xs font-semibold max-md:w-16 md:text-lg">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Showcase;
