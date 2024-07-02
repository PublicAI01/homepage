import Image from 'next/image';

import GridPattern from '@/app/components/GridPattern';
import DataAPISuite from '@/app/products/sections/DataAPISuite';
import DataHub from '@/app/products/sections/DataHub';
import DataHunter from '@/app/products/sections/DataHunter';
import Index from '@/app/products/sections/Index';
import Showcase from '@/app/products/sections/Showcase';
import VectorDatabase from '@/app/products/sections/VectorDatabase';
import ProductsCone from '@/assets/image/products-cone.png';

const Products = () => {
	return (
		<main
			className="relative pb-32"
			style={{
				marginTop: 'var(--header-height)',
			}}>
			<GridPattern className="-z-[1]" />

			<Image
				className="container absolute top-0 w-4/6 inset-x-[16.666667%] -z-[1]"
				aria-hidden
				src={ProductsCone}
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
