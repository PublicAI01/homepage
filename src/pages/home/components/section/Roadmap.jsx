import { Typography } from '@douyinfe/semi-ui';
import { useRef } from 'react';
import { RoadMapCard, SectionWrap } from './styled';

const cardData = [
  { title: 'Q1 2023', text: 'Publishes the whitepaper. Completes the MVP and the seed funding round. Issues the Marker Genesis NFT series for early backers.' },
  { title: 'Q2 2023', text: 'Develops Public.AI V1. Optimizes marketing campaigns, BD pipelines, and community accelerator and support programs.' },
  { title: 'Q3 2023', text: 'Launches Public.AI V1 testnet. Initiates the Public.AI genesis airdrop.' },
  { title: 'Q4 2023', text: 'Launches Public.AI V1 mainnet.' },
];

function Roadmap() {
  const cardBoxRef = useRef();

  const onClickCard = (e) => {
    const target = e.currentTarget;
    const { offsetLeft, clientWidth } = target;
    const { offsetWidth, clientWidth: boxClientWidth } = cardBoxRef.current;
    const moveLeft = (boxClientWidth - clientWidth) / 2;
    cardBoxRef.current.scrollTo(offsetLeft < (offsetWidth / 2) ? 0 : offsetLeft - moveLeft, 0);
  };

  return (
    <SectionWrap id="roadmap" className="bg-my-gray-white">
      <Typography.Title className="text-black">Roadmap</Typography.Title>
      <div className="cards mt-8 flex overflow-x-auto p-2 whitespace-nowrap scroll-smooth" ref={cardBoxRef}>
        {cardData.map((item) => (
          <RoadMapCard key={item.title} onClick={onClickCard}>
            <Typography.Title className="whitespace-normal !text-2xl">{item.title}</Typography.Title>
            <Typography.Paragraph className="mt-3 whitespace-normal text-base xmd:!text-sm">{item.text}</Typography.Paragraph>
          </RoadMapCard>
        ))}
      </div>
    </SectionWrap>
  );
}

export default Roadmap;
