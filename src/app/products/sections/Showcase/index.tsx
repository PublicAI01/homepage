import Title from '@/components/Title';

const Showcase = () => {
	return (
		<section className="container flex flex-col items-center mx-auto mt-40 bg-b3 py-14">
			<Title>Showcase</Title>
			<h1 className="text-3xl font-bold text-center text-white mt-14">
				AI Agents for Public Blockchains
			</h1>
			<h2 className="mb-10 text-lg font-medium text-center text-white mt-7 px-[20%]">
				We offer data services for various public blockchain networks,
				empowering them to create Custom AI Agents capable of executing diverse
				tasks from data analysis to automated decision-making.
			</h2>
			<h1 className="mt-32 text-3xl font-bold text-center text-white">
				Empowerment for AI Developers
			</h1>
			<h2 className="mb-10 text-lg font-medium text-center text-white mt-7 px-[20%]">
				Empower AI developers with the tools necessary to simplify the creation,
				deployment, and customization of AI Agents, streamlining the development
				process.
			</h2>
		</section>
	);
};

export default Showcase;
