import { Typography } from '@douyinfe/semi-ui';
import { RoadMapCard, SectionWrap } from './styled';
import RowCardWrap from '@/components/comm/RowCardWrap';
import CardItem from '@/components/comm/RowCardWrap/CardItem';

const cardData = [
  { title: 'Q1 2023', text: 'Publishes the whitepaper. Completes the MVP and the seed funding round. Issues the Marker Genesis NFT series for early backers.' },
  { title: 'Q2 2023', text: 'Develops Public.AI V1. Optimizes marketing campaigns, BD pipelines, and community accelerator and support programs.' },
  { title: 'Q3 2023', text: 'Launches Public.AI V1 testnet. Initiates the Public.AI genesis airdrop.' },
  { title: 'Q4 2023', text: 'Launches Public.AI V1 mainnet.' },
];

function Roadmap() {
  return (
    <div className="bg-my-gray-white">
      <SectionWrap>
        <Typography.Title data-aos="fade-up" className="text-black">Roadmap</Typography.Title>
        <div data-aos="fade-up">
          <RowCardWrap className="mt-8">
            {cardData.map((item) => (
              <CardItem key={item.title}>
                <RoadMapCard className="cursor-pointer">
                  <Typography.Title className="whitespace-normal !text-2xl">{item.title}</Typography.Title>
                  <Typography.Paragraph className="mt-3 whitespace-normal text-base xmd:!text-sm">{item.text}</Typography.Paragraph>
                </RoadMapCard>
              </CardItem>
            ))}

          </RowCardWrap>
        </div>
      </SectionWrap>
    </div>
  );
}

export default Roadmap;
