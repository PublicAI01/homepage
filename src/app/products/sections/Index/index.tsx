import clsx from 'clsx';

import SwiperGroup from '@/app/products/components/SwiperGroup';
import styles from '@/app/products/sections/Index/Index.module.css';

const Index = () => {
	return (
		<section className="flex flex-col justify-center min-h-svh">
			<h1 className="text-3xl font-semibold tracking-wide text-center text-white">
				<b className="block mb-2 text-5xl">Building</b> Craft AI with Collective
				Intelligence
			</h1>
			<h3 className="mt-3 mb-24 text-xl font-normal text-center text-white">
				Harness the synergy of Data Hunter&apos;s seamless collection and Data
				Hub&apos;s collaborative validation to{' '}
				<b className={clsx(styles.typing, 'text-p1 block mx-auto mt-3')}>
					supercharge AI with tailored large language models.
				</b>
			</h3>
			<SwiperGroup />
		</section>
	);
};

export default Index;
