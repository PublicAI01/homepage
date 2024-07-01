import clsx from 'clsx';
import Image from 'next/image';

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
import Title from '@/components/Title';
import { DATA_CARD_BORDER_WITH_ALPHA } from '@/constant/border';

const Partners = () => {
	return (
		<>
			<div
				aria-hidden
				id="partners"
				className="w-screen h-0"></div>
			<section
				className={clsx(
					styles['animate-border'],
					'container mx-auto mt-20 flex flex-col items-center py-7 px-24 relative',
				)}>
				<div
					aria-hidden
					className={clsx(
						styles['animate-shadow'],
						'bg-primary/20 absolute inset-y-0 w-1/4 blur-[96px]',
					)}></div>
				<Title className="mb-10">Partners</Title>
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
						className="w-full mb-14">
						<h3 className="mb-6 text-xl font-semibold text-white">
							{group.title}
						</h3>
						<div className="grid grid-cols-3 gap-6 gap-x-28">
							{group.children.map((item, index) => (
								<article
									key={index}
									className="py-2"
									style={{
										background: `url(${DATA_CARD_BORDER_WITH_ALPHA})`,
									}}>
									<Image
										className="w-auto mx-auto h-11"
										src={item.image}
										alt={item.name}
									/>
								</article>
							))}
						</div>
					</section>
				))}
			</section>
		</>
	);
};

export default Partners;
