import { Typography } from '@douyinfe/semi-ui';
import ReactECharts from 'echarts-for-react';
import { SectionWrap } from './styled';

export function Tokenomics() {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} ({c}%)',
      textStyle: {
        fontFamily: 'Bai Jamjuree',
      },
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: '#fff',
        fontFamily: 'Bai Jamjuree',
      },
    },
    title: {
      show: true,
      x: 'center',
      y: 'center',
      text: '$PUBLIC Total Supply\n\n1 Billion',
      textStyle: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Bai Jamjuree',
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        selectedMode: 'single',
        radius: ['30%', '60%'],
        label: {
          formatter: '  {b|{b}} {per|{c}%}  ',
          backgroundColor: '#F6F8FC',
          borderColor: 'inherit',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'Bai Jamjuree',
              lineHeight: 33,
            },
            per: {
              color: '#fff',
              backgroundColor: 'inherit',
              padding: [3, 4],
              borderRadius: 4,
              fontFamily: 'Bai Jamjuree',
            },
          },
        },
        labelLine: {
          length: 30,
        },
        data: [
          { name: 'Seed Round', value: 10 },
          { name: 'Private Round', value: 10 },
          { name: 'Public Round', value: 1 },
          { name: 'Marketing', value: 10 },
          { name: 'Team', value: 16 },
          { name: 'Advisors', value: 3 },
          { name: 'Foundation', value: 9 },
          { name: 'Emissions', value: 41 },
        ],
      },
    ],
  };

  return (
    <div className="bg-black pb-52 xmd:hidden">
      <SectionWrap id="tokenomics">
        <Typography.Title data-aos="fade-up" className="text-white">Tokenomics</Typography.Title>
        <div data-aos="fade-up">
          <ReactECharts className="w-full h-full" option={option} opts={{ height: '500' }} />
        </div>
      </SectionWrap>
    </div>
  );
}
