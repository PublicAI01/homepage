import Image from 'next/image';

import GridPattern from '@/app/components/GridPattern';
import DataAPISuite from '@/app/products/sections/DataAPISuite';
import DataHub from '@/app/products/sections/DataHub';
import DataHunter from '@/app/products/sections/DataHunter';
import Index from '@/app/products/sections/Index';
import Showcase from '@/app/products/sections/Showcase';
import VectorDatabase from '@/app/products/sections/VectorDatabase';
import decorativeCone from '@/assets/svg/decorative-cone.svg';

const Products = () => {
  return (
    <main
      className="relative pb-32"
      style={{
        marginTop: 'var(--header-height)',
      }}>
      <GridPattern className="-z-1" />

      <Image
        className="absolute -top-[var(--header-height)] -z-1 h-screen w-auto -rotate-[25deg] scale-150 opacity-70 md:inset-x-[16.666667%] md:-top-80 md:w-2/3 lg:h-auto lg:scale-75"
        aria-hidden
        src={decorativeCone}
        alt="decorative cone picture"
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
