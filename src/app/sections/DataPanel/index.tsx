import buildersData from '@/assets/svg/builder-icon.svg?react';
import datasetSizeData from '@/assets/svg/dataset-size-data.svg?react';
import partnersData from '@/assets/svg/partners-data.svg?react';
import validatorsData from '@/assets/svg/validators-data.svg?react';
import workersData from '@/assets/svg/workers-data.svg?react';
import SectionWrapper from '@/components/SectionWrapper';

const DataPanel = () => {
  return (
    <SectionWrapper
      className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-8 xl:gap-16"
      useFlexLayout={false}>
      {[
        { Icon: workersData, title: 'Workers', data: '1.4M+' },
        { Icon: validatorsData, title: 'Validators', data: '300K+' },
        { Icon: buildersData, title: 'Builders', data: '200K+' },
        { Icon: datasetSizeData, title: 'Dataset Size', data: '100T+' },
        { Icon: partnersData, title: 'Partners', data: '50+' },
      ].map((item, index) => (
        <div
          key={index}
          className="frosted-card app-card flex flex-col items-center justify-center rounded-xl pt-4 pb-3 lg:pt-7 lg:pb-4">
          <item.Icon className="size-10" />
          <strong className="my-4 text-xl font-bold">{item.data}</strong>
          <h3 className="text-base font-normal">{item.title}</h3>
        </div>
      ))}
    </SectionWrapper>
  );
};

export default DataPanel;
