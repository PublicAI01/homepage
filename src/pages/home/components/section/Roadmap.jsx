import { Typography } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { RoadMapCard, SectionWrap } from './styled';

const cardData = [
  { title: '2023 Jan', text: '春节前完成MVP，白皮书，  BP，通过NFT营销计划积累最初的Marker流量，Twitter，Discord，Telegram 社交媒体运营' },
  { title: '2023 Feb', text: '种子轮融资300万美元。计划融资10%股权 (SAFE+Token Warrant)' },
  { title: '2023 Q2-Q3', text: '项目开发，社交媒体运营，资源积累' },
  { title: '2023 Q4', text: '产品上线试运营，BD' },
];

function Roadmap() {
  return (
    <SectionWrap>

      <LinearGradientText textClassName="leading-none text-[48px]" text="ROADMAP" showIcon />

      <div className="cards mt-8 flex items-center overflow-y-auto p-2">
        {cardData.map((item) => (
          <RoadMapCard key={item.title}>
            <Typography.Title>{item.title}</Typography.Title>
            <Typography.Text className="mt-2">{item.text}</Typography.Text>
          </RoadMapCard>
        ))}
      </div>
    </SectionWrap>
  );
}

export default Roadmap;
