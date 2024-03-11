import RowCardWrap from '@/components/comm/RowCardWrap';
import CardItem from '@/components/comm/RowCardWrap/CardItem';
import { Typography } from '@douyinfe/semi-ui';
import { RoadMapCard, SectionWrap } from './styled';

const cardData = [
  {
    title: 'Q4 2023',
    text: [
      "'Train-AI-to-Earn' TestNet Launch",
      'AI Builder Level Upgrade',
      'X Dataset Upgrade',
      'RLHF Annotation Tool Develop',
    ].join('<br />'),
  },
  {
    title: 'Q1 2024',
    text: [
      "'Train-AI-to-Earn' MainNet Launch",
      'User Authorization Data License NFT Launch',
      'BFT Data Consensus Algorithm Update',
      'AI Validator Level Features Upgrade',
    ].join('<br />'),
  },
  {
    title: 'Q2 2024',
    text: [
      'AI Ecosystem Tokens Stake Launch',
      'Finetuned Web3 Airdrop LLMs',
      'Chrome Browser X-Plugin',
      'DID Features Upgrade',
      '$PUBLIC TGE & Listing',
    ].join('<br />'),
  },
  {
    title: 'Q3 2024',
    text: [
      'DePIN AI Training Camera Online',
      'AI DePIN Data Hub Online',
      'Token Staking Upgrade',
      'Dataset Marketplace Online',
    ].join('<br />'),
  },
  {
    title: 'Q4 2024',
    text: [
      'AI Bots Marketplace Upgrade',
      'Builder DID Tags System Online',
      'API for Multimodal AI Data',
      'Ecosystem Growth',
    ].join('<br />'),
  },
];

function Roadmap() {
  return (
    <div className="bg-my-gray-white">
      <SectionWrap id="roadmap">
        <Typography.Title data-aos="fade-up" className="text-black">
          Roadmap
        </Typography.Title>
        <div data-aos="fade-up">
          <RowCardWrap className="mt-8">
            {cardData.map((item) => (
              <CardItem key={item.title}>
                <RoadMapCard className="cursor-pointer">
                  <Typography.Title className="whitespace-normal !text-2xl select-none">
                    {item.title}
                  </Typography.Title>
                  <p
                    className="mt-3 whitespace-normal text-base xmd:!text-sm select-none"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
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
