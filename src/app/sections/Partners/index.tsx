import clsx from 'clsx';
import Image from 'next/image';

import aboutStyles from '@/app/sections/About/About.module.css';
import styles from '@/app/sections/Partners/Partners.module.css';
import ZeroG from '@/assets/partners/0g.png';
import ZeroXScope from '@/assets/partners/0x-scope.png';
import AbakaAI from '@/assets/partners/abaka-ai.png';
import AgentLayer from '@/assets/partners/agent-layer.png';
import AmazonMechaincalTurk from '@/assets/partners/amazon.png';
import Bloomberg from '@/assets/partners/bloomberg.png';
import CoinDesk from '@/assets/partners/coin-desk.png';
import Cointelegraph from '@/assets/partners/cointelegraph.png';
import Combo from '@/assets/partners/combo.png';
import Decrypt from '@/assets/partners/decrypt.png';
import FlockIO from '@/assets/partners/flock-io.png';
import ForesightVentures from '@/assets/partners/foresight.png';
import Glacier from '@/assets/partners/glacier.png';
import HuggingFace from '@/assets/partners/hugging-face.png';
import IONet from '@/assets/partners/io-net.png';
import IOBCCapital from '@/assets/partners/iobc.png';
import MantaNetwork from '@/assets/partners/manta.png';
import Marlin from '@/assets/partners/marlin.png';
import Midjourney from '@/assets/partners/midjourney.png';
import Morph from '@/assets/partners/morph.png';
import Nesa from '@/assets/partners/nesa.png';
import Nimble from '@/assets/partners/nimble.png';
import SolanaFoundation from '@/assets/partners/solana.png';
import StabilityAI from '@/assets/partners/stability-ai.png';
import StanfordUniversity from '@/assets/partners/stanford.png';
import TheBlock from '@/assets/partners/the-block.png';
import SectionWrapper from '@/components/SectionWrapper';
import { DATA_CARD_BORDER_WITH_ALPHA } from '@/constant/border';

const Partners = () => {
	return (
		<SectionWrapper
			className={clsx(aboutStyles['animate-border'], 'py-7 lg:px-24')}
			title="Partners"
			anchorId="partners">
			<div
				aria-hidden
				className={clsx(
					styles['animate-shadow'],
					'bg-primary/20 blur-[96px] absolute max-md:h-1/6 max-md:inset-x-0 md:w-1/4 md:inset-y-0',
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
						{ image: Midjourney, name: 'Midjourney' },
						{ image: AmazonMechaincalTurk, name: 'Amazon Mechaincal Turk' },
						{ image: HuggingFace, name: 'HuggingFace' },
						{ image: StabilityAI, name: 'Stability.ai' },
						{ image: AbakaAI, name: 'Abaka AI' },
						{ image: StanfordUniversity, name: 'Stanford University' },
					],
				},
				{
					title: 'Trusted by Leading Web3 Industry Partners',
					children: [
						{ image: ZeroXScope, name: '0x Scope' },
						{ image: MantaNetwork, name: 'Manta Network' },
						{ image: Marlin, name: 'Marlin' },
						{ image: AgentLayer, name: 'Agent Layer' },
						{ image: Glacier, name: 'Glacier' },
						{ image: Combo, name: 'Combo' },
						{ image: ZeroG, name: '0G' },
						{ image: Morph, name: 'Morph' },
						{ image: Nesa, name: 'Nesa' },
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
					className="w-full flex flex-col px-4 mt-10 lg:mb-14 md:px-6">
					<h3 className="mb-6 text-base font-semibold text-white md:text-xl">
						{group.title}
					</h3>
					<div className="grid grid-cols-2 gap-4 lg:gap-x-28 md:grid-cols-3 md:gap-6">
						{group.children.map((item, index) => (
							<article
								key={index}
								className="py-2"
								style={{
									background: `url(${DATA_CARD_BORDER_WITH_ALPHA})`,
								}}>
								<Image
									className="mx-auto w-auto h-7 lg:h-11 md:h-9"
									src={item.image}
									alt={item.name}
								/>
							</article>
						))}
					</div>
				</section>
			))}
		</SectionWrapper>
	);
};

export default Partners;
