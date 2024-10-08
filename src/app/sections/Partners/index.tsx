import Image from 'next/image';

import aboutStyles from '@/app/sections/About/About.module.css';
import styles from '@/app/sections/Partners/Partners.module.css';
import ZeroG from '@/assets/partners/0g.png';
import ZeroXScope from '@/assets/partners/0x-scope.png';
import AbakaAI from '@/assets/partners/abaka-ai.png';
import AmazonMechaincalTurk from '@/assets/partners/amazon.png';
import Autonomys from '@/assets/partners/autonomys.png';
import Bloomberg from '@/assets/partners/bloomberg.png';
import Catizen from '@/assets/partners/catizen.png';
import chainbase from '@/assets/partners/chainbase.png';
import Chasm from '@/assets/partners/chasm.png';
import CoinDesk from '@/assets/partners/coin-desk.png';
import Cointelegraph from '@/assets/partners/cointelegraph.png';
import Decrypt from '@/assets/partners/decrypt.png';
import FlockIO from '@/assets/partners/flock-io.png';
import ForesightVentures from '@/assets/partners/foresight.png';
import Glacier from '@/assets/partners/glacier.png';
import HuggingFace from '@/assets/partners/hugging-face.png';
import HumanCode from '@/assets/partners/human-code.png';
import Hyperbolic from '@/assets/partners/hyperbolic.png';
import ibm from '@/assets/partners/ibm.png';
import IONet from '@/assets/partners/io-net.png';
import IOBCCapital from '@/assets/partners/iobc-capital.png';
import MantaNetwork from '@/assets/partners/manta.png';
import Marlin from '@/assets/partners/marlin.png';
import Midjourney from '@/assets/partners/midjourney.png';
import MassachusettsInstituteOfTechnology from '@/assets/partners/mit.png';
import Morph from '@/assets/partners/morph.png';
import NanYangTechnologicalUniversity from '@/assets/partners/nanyang.png';
import Narra from '@/assets/partners/narra.png';
import Near from '@/assets/partners/near.png';
import Nimble from '@/assets/partners/nimble.png';
import SolanaFoundation from '@/assets/partners/solana-foundation.png';
import StabilityAI from '@/assets/partners/stability-ai.png';
import StanfordUniversity from '@/assets/partners/standford.png';
import TheBlock from '@/assets/partners/the-block.png';
import ZKPass from '@/assets/partners/zk-pass.png';
import SectionWrapper from '@/components/SectionWrapper';
import { DATA_CARD_BORDER_WITH_ALPHA } from '@/constant/border';
import { cn } from '@/utils';

const Partners = () => {
  return (
    <SectionWrapper
      className={cn(aboutStyles['animate-border'], 'py-7 lg:px-24')}
      title="Partners"
      anchorId="partners">
      <div
        aria-hidden
        className={cn(
          styles['animate-shadow'],
          'absolute z-0 bg-primary/20 blur-[96px] max-md:inset-x-0 max-md:h-1/6 md:inset-y-0 md:w-1/4',
        )}></div>
      {[
        {
          title: 'Trusted by Leading Investors',
          children: [
            { image: IOBCCapital, name: 'IOBC Capital' },
            { image: ForesightVentures, name: 'Foresight Ventures' },
            { image: SolanaFoundation, name: 'Solana Foundation' },
          ],
        },
        {
          title: 'Trusted by Leading AI Industry Partners',
          children: [
            { image: StanfordUniversity, name: 'Stanford University' },
            {
              image: NanYangTechnologicalUniversity,
              name: 'NanYang Technological University',
            },
            {
              image: MassachusettsInstituteOfTechnology,
              name: 'Massachusetts Institute of Technology',
            },
            { image: StabilityAI, name: 'Stability.ai' },
            { image: AbakaAI, name: 'Abaka AI' },
            { image: ibm, name: 'IBM' },
            { image: Midjourney, name: 'Midjourney' },
            { image: AmazonMechaincalTurk, name: 'Amazon Mechaincal Turk' },
            { image: HuggingFace, name: 'HuggingFace' },
          ],
        },
        {
          title: 'Trusted by Leading Web3 Industry Partners',
          children: [
            { image: Near, name: 'Near' },
            { image: chainbase, name: 'chainbase' },
            // { image: Story, name: 'Story' },
            { image: ZeroG, name: '0G' },
            { image: Hyperbolic, name: 'Hyperbolic' },
            { image: Catizen, name: 'Catizen' },
            { image: Autonomys, name: 'Autonomys' },
            { image: ZeroXScope, name: '0x Scope' },
            { image: MantaNetwork, name: 'Manta Network' },
            { image: Marlin, name: 'Marlin' },
            { image: Chasm, name: 'Chasm' },
            // { image: AgentLayer, name: 'Agent Layer' },
            { image: Glacier, name: 'Glacier' },
            { image: Narra, name: 'Narra' },
            { image: ZKPass, name: 'zkPass' },
            { image: Morph, name: 'Morph' },
            { image: HumanCode, name: 'HumanCode' },
            { image: FlockIO, name: 'Flock IO' },
            { image: Nimble, name: 'Nimble' },
            { image: IONet, name: 'IO.Net' },
          ],
        },
        {
          title: 'Featured by Leading Media',
          children: [
            { image: Bloomberg, name: 'Bloomberg' },
            { image: TheBlock, name: 'TheBlock' },
            { image: CoinDesk, name: 'CoinDesk' },
            { image: Cointelegraph, name: 'Cointelegraph' },
            { image: Decrypt, name: 'Decrypt' },
          ],
        },
      ].map((group, index) => (
        <section
          key={index}
          className="z-1 mt-10 flex w-full flex-col px-4 md:px-6 lg:mb-14">
          <h3 className="mb-6 text-base font-semibold text-white md:text-xl">
            {group.title}
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:gap-x-28">
            {group.children.map((item, index) => (
              <div
                key={index}
                className="py-2"
                style={{
                  background: `url(${DATA_CARD_BORDER_WITH_ALPHA})`,
                }}>
                <Image
                  className="mx-auto h-6 w-auto md:h-9 lg:h-11"
                  src={item.image}
                  height={44}
                  alt={item.name}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </SectionWrapper>
  );
};

export default Partners;
