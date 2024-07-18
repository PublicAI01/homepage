import computerUpload from '@/assets/svg/computer-upload.svg?react';
import electronicsBoard from '@/assets/svg/electronics-board.svg?react';
import searchCheck from '@/assets/svg/search-check.svg?react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';

const DataAPISuite = () => {
  return (
    <SectionWrapper
      className="lg:mt-40"
      title="Data API Suite"
      anchorId="api">
      <h3 className="mb-2 mt-10 text-center text-xl font-bold text-white md:text-3xl">
        Custom API Suite for Business
      </h3>
      <h4 className="text-center text-sm font-medium text-white md:text-lg">
        Enhance your business with our comprehensive data solutions.
      </h4>
      <section className="mt-5 flex flex-col items-center gap-3 md:mt-10 md:flex-row">
        {[
          {
            Icon: searchCheck,
            title: 'Tailored Solutions',
            content:
              'Each API is customizable to fit the unique requirements and workflows of various industries.',
          },
          {
            Icon: electronicsBoard,
            title: 'Scalable Architecture',
            content:
              'Build for the future with APIs that scale alongside your growing data needs.',
          },
          {
            Icon: computerUpload,
            title: 'Real-Time Data Processing',
            content:
              'Make informed, timely decisions with our real-time data processing capabilities.',
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="flex-1 self-stretch"
            title={item.title}
            content={item.content}>
            {<item.Icon />}
          </Card>
        ))}
      </section>
    </SectionWrapper>
  );
};

export default DataAPISuite;
