import SectionWrapper from '@/components/SectionWrapper';

const Showcase = () => {
  return (
    <SectionWrapper
      className="bg-b3 py-7 lg:py-14 lg:mt-40"
      title="Showcase"
      useMobileContainerWidth={false}>
      <h3 className="mt-14 text-xl font-bold text-center text-white lg:text-3xl">
        AI Agents for Public Blockchains
      </h3>
      <h5 className="mb-5 lg:mb-10 text-base lg:text-lg font-medium text-center text-white mt-7 lg:px-[20%] px-4">
        We offer data services for various public blockchain networks,
        empowering them to create Custom AI Agents capable of executing diverse
        tasks from data analysis to automated decision-making.
      </h5>
      <h3 className="mt-16 text-xl font-bold text-center text-white lg:mt-32 lg:text-3xl">
        Empowerment for AI Developers
      </h3>
      <h5 className="mb-5 lg:mb-10 text-base lg:text-lg font-medium text-center text-white mt-7 lg:px-[20%] px-4">
        Empower AI developers with the tools necessary to simplify the creation,
        deployment, and customization of AI Agents, streamlining the development
        process.
      </h5>
    </SectionWrapper>
  );
};

export default Showcase;
