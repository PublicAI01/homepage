import { Typography } from '@douyinfe/semi-ui';
import { useRef } from 'react';
import LinearGradientText from '../LinearGradientText';
import { RoadMapCard, SectionWrap } from './styled';

const cardData = [
  { title: 'Q1 2023', text: 'Publishes the whitepaper. Completes the MVP and the seed funding round. Issues the Marker Genesis NFT series for early backers.' },
  { title: 'Q2 2023', text: 'Develops MarkerDAO V1. Optimizes marketing campaigns, BD pipelines, and community accelerator and support programs.' },
  { title: 'Q3 2023', text: 'Launches MarkerDAO V1 testnet. Initiates the MarkerDAO genesis airdrop.' },
  { title: 'Q4 2023', text: 'Launches MarkerDAO V1 mainnet.' },
];

function Roadmap() {
  const cardBoxRef = useRef();

  const onClickCard = (e) => {
    const target = e.currentTarget;

    cardBoxRef.current.scrollTo(target.offsetLeft, 0);
    // e = e.target.parentNode || e.target;
    // console.log(cardBoxRef.current);
    // console.log(e);
  };

  return (
    <SectionWrap id="roadmap">
      <LinearGradientText
        textClassName="leading-none text-[48px]"
        text="Roadmap"
        showIcon
      />
      <div className="cards mt-8 flex overflow-x-auto p-2 whitespace-nowrap scroll-smooth" ref={cardBoxRef}>
        {cardData.map((item) => (
          <RoadMapCard key={item.title} onClick={onClickCard}>
            <Typography.Title className="whitespace-normal">{item.title}</Typography.Title>
            <Typography.Paragraph className="mt-2 whitespace-normal !text-base">{item.text}</Typography.Paragraph>
          </RoadMapCard>
        ))}
      </div>
    </SectionWrap>
  );
}

export default Roadmap;
