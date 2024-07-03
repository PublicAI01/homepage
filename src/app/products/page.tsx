import Image from 'next/image';

import GridPattern from '@/app/components/GridPattern';
import DataAPISuite from '@/app/products/sections/DataAPISuite';
import DataHub from '@/app/products/sections/DataHub';
import DataHunter from '@/app/products/sections/DataHunter';
import Index from '@/app/products/sections/Index';
import Showcase from '@/app/products/sections/Showcase';
import VectorDatabase from '@/app/products/sections/VectorDatabase';
import productsCone from '@/assets/svg/products-cone.svg';

const Products = () => {
	return (
		<main
			className="relative pb-32"
			style={{
				marginTop: 'var(--header-height)',
			}}>
			<GridPattern className="-z-1" />

			<Image
				className="absolute w-auto h-screen md:h-auto scale-150 md:scale-75 -top-[var(--header-height)] md:-top-80 md:w-4/6 md:inset-x-[16.666667%] -rotate-[25deg] -z-1"
				aria-hidden
				src={productsCone}
				alt="decorative pictures"
			/>

			<Index />
			<DataHunter />
			<DataHub />
			<VectorDatabase />
			<DataAPISuite />
			<Showcase />
		</main>
	);
};

export default Products;
