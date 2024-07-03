import SectionWrapper from '@/components/SectionWrapper';

const Showcase = () => {
	return (
		<SectionWrapper
			className="md:mt-40 bg-b3 py-7 md:py-14"
			title="Showcase"
			useMobileContainerWidth={false}>
			<h3 className="text-xl md:text-3xl font-bold text-center text-white mt-14">
				AI Agents for Public Blockchains
			</h3>
			<h5 className="mb-5 md:mb-10 text-base md:text-lg font-medium text-center text-white mt-7 md:px-[20%] px-4">
				We offer data services for various public blockchain networks,
				empowering them to create Custom AI Agents capable of executing diverse
				tasks from data analysis to automated decision-making.
			</h5>
			<h3 className="mt-16 md:mt-32 text-xl md:text-3xl font-bold text-center text-white">
				Empowerment for AI Developers
			</h3>
			<h5 className="mb-5 md:mb-10 text-base md:text-lg font-medium text-center text-white mt-7 md:px-[20%] px-4">
				Empower AI developers with the tools necessary to simplify the creation,
				deployment, and customization of AI Agents, streamlining the development
				process.
			</h5>
		</SectionWrapper>
	);
};

export default Showcase;
