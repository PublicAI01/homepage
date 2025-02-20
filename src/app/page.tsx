import About from '@/app/sections/About';
import DataPanel from '@/app/sections/DataPanel';
import FAQ from '@/app/sections/FAQ';
import Index from '@/app/sections/Index';
import Partners from '@/app/sections/Partners';
import Resource from '@/app/sections/Resource';
import Works from '@/app/sections/Works';

export default function Home() {
  return (
    <>
      <Index />
      <About />
      <Works />
      <DataPanel />
      <Partners />
      <Resource />
      <FAQ />
    </>
  );
}
