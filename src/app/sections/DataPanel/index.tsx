'use client';

import buildersData from '@/assets/svg/builder-icon.svg?react';
import datasetSizeData from '@/assets/svg/dataset-size-data.svg?react';
import partnersData from '@/assets/svg/partners-data.svg?react';
import validatorsData from '@/assets/svg/validators-data.svg?react';
import workersData from '@/assets/svg/workers-data.svg?react';
import cardStyles from '@/components/Card/Card.module.css';
import SectionWrapper from '@/components/SectionWrapper';
import { cn } from '@/utils';

const DataPanel = () => {
  return (
    <SectionWrapper
      className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-8 xl:gap-16"
      useFlexLayout={false}>
      {[
        { Icon: workersData, title: 'Workers', data: '400K+' },
        { Icon: validatorsData, title: 'Validators', data: '300K+' },
        { Icon: buildersData, title: 'Builders', data: '200K+' },
        { Icon: datasetSizeData, title: 'Dataset Size', data: '100T+' },
        { Icon: partnersData, title: 'Partners', data: '50+' },
      ].map((item, index) => (
        <div
          key={index}
          className={cn(
            cardStyles.card,
            'frosted-card flex size-full flex-col items-center justify-center rounded-xl pt-4 pb-3 transition-colors hover:border-white hover:bg-white lg:pt-7 lg:pb-4',
          )}
          onMouseEnter={(e) => {
            e.currentTarget.classList.remove('animate-card-flicker');
          }}
          onMouseLeave={(e) => {
            e.currentTarget.classList.add('animate-card-flicker');
          }}>
          <item.Icon className="size-10 transition-colors" />
          <strong className="my-4 text-xl font-bold transition-colors">
            {item.data}
          </strong>
          <h3 className="text-base font-normal transition-colors">
            {item.title}
          </h3>
        </div>
      ))}
    </SectionWrapper>
  );
};

export default DataPanel;
