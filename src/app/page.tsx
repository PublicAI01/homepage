import GridPattern from '@/app/components/GridPattern';
import About from '@/app/sections/About';
import DataPanel from '@/app/sections/DataPanel';
import FAQ from '@/app/sections/FAQ';
import Index from '@/app/sections/Index';
import Partners from '@/app/sections/Partners';
import Works from '@/app/sections/Works';

import Resource from './sections/Resource';

export default function Home() {
	return (
		<main
			className="relative"
			style={{
				marginTop: 'var(--header-height)',
			}}>
			<GridPattern className="-z-[1]" />

			<Index />
			<About />
			<Works />
			<DataPanel />
			<Partners />
			<Resource />
			<FAQ />
		</main>
	);
}
