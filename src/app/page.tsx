import About from '@/app/sections/About';
import FAQ from '@/app/sections/FAQ';
import Index from '@/app/sections/Index';
import LatestUpdates from '@/app/sections/LatestUpdates';
import Partners from '@/app/sections/Partners';
import Works from '@/app/sections/Works';

export default function Home() {
  return (
    <>
      <Index />
      <About />
      <Works />
      <Partners />
      <LatestUpdates />
      <FAQ />
    </>
  );
}
