import RowCardWrap from '@/components/comm/RowCardWrap';
import CardItem from '@/components/comm/RowCardWrap/CardItem';
import { Typography } from '@douyinfe/semi-ui';
import { RoadMapCard, SectionWrap } from './styled';

const cardData = [
  { title: 'Q4 2023', text: 'Mobile testing version goes live, mobile RHFL annotation tool launches, PC annotation tool Xmed reaches 50% completion, annotation verification algorithm and zCloaK DID integration implemented.' },
  { title: 'Q1 2024', text: 'Official mobile version released, data validation feature goes live, PC annotation tool Xmed launches, point cloud algorithm implemented, testing network goes live, airdrop activities planned.' },
  { title: 'Q2 2024', text: 'Integration of multi-chain wallets on mobile, xStream streaming processing tool integrated on PC, voxel algorithm integration, ZKLink integration, mainnet launch.' },
  { title: 'Q3 2024', text: 'Commence multimodal data generation model R&D, complete token staking system, develop data marketplace.' },
  { title: 'Q4 2024', text: 'Launch multimodal data generation models, optimize security performance, launch data marketplace, API for data upload goes live.' },
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
