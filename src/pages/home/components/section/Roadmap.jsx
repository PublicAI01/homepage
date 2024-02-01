import RowCardWrap from '@/components/comm/RowCardWrap';
import CardItem from '@/components/comm/RowCardWrap/CardItem';
import { Typography } from '@douyinfe/semi-ui';
import { RoadMapCard, SectionWrap } from './styled';

const cardData = [
  { title: 'Q4 2023', text: '\'Train To Earn\' Testnet Application Launch<br />EVM Wallet Upgrade<br />Open-Source Datasets Upgrade<br />RLHF annotation tool develop<br />Xmed annotation tool develop' },
  { title: 'Q1 2024', text: 'Byzantine data consensus algorithm Upgrade<br />AI Train Guild Function Launch <br />AI Bots Marketplace Launch<br />Trainer Level Function Upgrade <br />Task Reward Function Launch' },
  { title: 'Q2 2024', text: 'Guild Prize Pool Launch<br />Multi-Chain Wallet Function Upgrade<br />DID Function Upgrade<br />xStream Streaming Processing Tool<br />Voxel Algorithm Integration & ZKlink Integration' },
  { title: 'Q3 2024', text: 'Mainnet Launch<br />Ecosystem Growth <br />Genesis Airdrop<br />Token staking system<br />Data marketplace' },
  { title: 'Q4 2024', text: 'AI Bots Marketplace Upgrade<br />Trainer Achievement and DID Tags system<br />API for data upload launch<br />TGE' },
];

function Roadmap() {
  return (
    <div className="bg-my-gray-white">
      <SectionWrap id="roadmap">
        <Typography.Title data-aos="fade-up" className="text-black">Roadmap</Typography.Title>
        <div data-aos="fade-up">
          <RowCardWrap className="mt-8">
            {cardData.map((item) => (
              <CardItem key={item.title}>
                <RoadMapCard className="cursor-pointer">
                  <Typography.Title className="whitespace-normal !text-2xl">{item.title}</Typography.Title>
                  <p className="mt-3 whitespace-normal text-base xmd:!text-sm" dangerouslySetInnerHTML={{ __html: item.text }} />
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
