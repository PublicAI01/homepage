import Image from 'next/image';

import borderStyles from '@/app/components/AnimatedBorder/AnimatedBorder.module.css';
import styles from '@/app/sections/Partners/Partners.module.css';
import ZeroG from '@/assets/partners/0g.png';
import ZeroXScope from '@/assets/partners/0x-scope.png';
import AbakaAI from '@/assets/partners/abaka-ai.png';
import AmazonMechaincalTurk from '@/assets/partners/amazon.png';
import Autonomys from '@/assets/partners/autonomys.png';
import BBF from '@/assets/partners/bbf.png';
import Bloomberg from '@/assets/partners/bloomberg.png';
import Catizen from '@/assets/partners/catizen.png';
import chainbase from '@/assets/partners/chainbase.png';
import Chasm from '@/assets/partners/chasm.png';
import CoinDesk from '@/assets/partners/coin-desk.png';
import Cointelegraph from '@/assets/partners/cointelegraph.png';
import Decrypt from '@/assets/partners/decrypt.png';
import FlockIO from '@/assets/partners/flock-io.png';
import ForesightVentures from '@/assets/partners/foresight-ventures.png';
import G20 from '@/assets/partners/g20.png';
import Glacier from '@/assets/partners/glacier.png';
import HuggingFace from '@/assets/partners/hugging-face.png';
import HumanCode from '@/assets/partners/human-code.png';
import Hyperbolic from '@/assets/partners/hyperbolic.png';
import IBCGroup from '@/assets/partners/ibc-group.png';
import ibm from '@/assets/partners/ibm.png';
import IONet from '@/assets/partners/io-net.png';
import IOBCCapital from '@/assets/partners/iobc-capital.png';
import MantaNetwork from '@/assets/partners/manta.png';
import Marlin from '@/assets/partners/marlin.png';
import MHVentures from '@/assets/partners/mh-ventures.png';
import Midjourney from '@/assets/partners/midjourney.png';
import MassachusettsInstituteOfTechnology from '@/assets/partners/mit.png';
import Morph from '@/assets/partners/morph.png';
import NanYangTechnologicalUniversity from '@/assets/partners/nanyang.png';
import Narra from '@/assets/partners/narra.png';
import Near from '@/assets/partners/near.png';
import NearFoundation from '@/assets/partners/near-foundation.png';
import Nexus from '@/assets/partners/nexus.png';
import Nimble from '@/assets/partners/nimble.png';
import SBA from '@/assets/partners/sba.png';
import SolanaFoundation from '@/assets/partners/solana-foundation.png';
import StabilityAI from '@/assets/partners/stability-ai.png';
import StanfordUniversity from '@/assets/partners/standford.png';
import Stc from '@/assets/partners/stc.png';
import TAISU from '@/assets/partners/taisu.png';
import TheBlock from '@/assets/partners/the-block.png';
import Tykhe from '@/assets/partners/tykhe.png';
import UXLink from '@/assets/partners/uxlink.png';
import WhitewaterLabs from '@/assets/partners/whitewater-labs.png';
import YGG from '@/assets/partners/ygg.png';
import ZKPass from '@/assets/partners/zk-pass.png';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const Partners = () => {
  return (
    <SectionWrapper
      className={cn(
        borderStyles['animated-border'],
        'will-change-[transform,opacity]',
        '3xl:px-24 py-7 md:px-12 xl:px-16 2xl:px-20',
      )}
      title="Partners"
      anchorId="partners">
      <div
        aria-hidden
        className={cn(
          styles['animated-shadow'],
          'bg-primary/20 absolute z-0 blur-3xl max-md:inset-x-0 max-md:h-1/6 md:inset-y-0 md:w-1/4',
        )}></div>
      {[
        {
          title: 'Trusted by Leading Investors',
          children: [
            { image: Stc, name: 'Stc Group' },
            { image: BBF, name: 'Blockchain Builders Fund' },
            { image: SBA, name: 'Stanford Blockchain Accelerator' },
            { image: Tykhe, name: 'Tykhe Block Ventures' },
            { image: NearFoundation, name: 'NEAR Foundation' },
            { image: TAISU, name: 'TAISU' },
            { image: MHVentures, name: 'MH Ventures' },
            { image: YGG, name: 'Yield Guild Games' },
            // { image: KineticKollective, name: 'Kinetic Kollective' },
            { image: IBCGroup, name: 'IBC Invest Incubate Accelerate' },
            { image: WhitewaterLabs, name: 'Whitewater Labs' },
            { image: G20, name: 'G20 Group' },
            { image: UXLink, name: 'UXLINK' },
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
            { image: Nexus, name: 'Nexus' },
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
            { image: Catizen, name: 'Catizen' },
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
                className="frosted-card rounded-lg py-1.5">
                <Image
                  className="3xl:h-11 mx-auto h-6 w-auto md:h-9 xl:h-10"
                  src={item.image}
                  height={44}
                  alt={item.name}
                  title={item.name}
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
