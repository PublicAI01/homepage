import resourceDocumentHover from '@/assets/imgs/home/resource-document-hover.png';
import resourceDocument from '@/assets/imgs/home/resource-document.png';
import resourcePriceHover from '@/assets/imgs/home/resource-price-hover.png';
import resourcePrice from '@/assets/imgs/home/resource-price.png';
import resourceUserDataHover from '@/assets/imgs/home/resource-user-data-hover.png';
import resourceUserData from '@/assets/imgs/home/resource-user-data.png';
import resourceWhitePaperHover from '@/assets/imgs/home/resource-whitepaper-hover.png';
import resourceWhitePaper from '@/assets/imgs/home/resource-whitepaper.png';
import { heightToTop } from '@/utils/utils';
import {
  Col, Image, Row, Typography,
} from '@douyinfe/semi-ui';
import { useContext, useState } from 'react';
import styled from 'styled-components';
import ActiveFQContext from '../../ActiveFQContext';
import { SectionWrap } from './styled';

const cardData = [{
  img: resourcePrice,
  hoverImg: resourcePriceHover,
  title: 'Price',
},
{
  img: resourceWhitePaper,
  hoverImg: resourceWhitePaperHover,
  title: 'Product Guideline',
  onClick: () => {
    window.open('https://docs.publicai.io/publicai-documentation/');
  },
},
{
  img: resourceDocument,
  hoverImg: resourceDocumentHover,
  title: 'Development Doc',
  onClick: () => {
    window.open('https://github.com/PublicAI01');
  },
},
{
  img: resourceUserData,
  hoverImg: resourceUserDataHover,
  title: 'Dune',
  onClick: () => {
    window.open('https://dune.com/publicaiweb3/publicai-dashboard');
  },
}];

const StyledCard = styled.div`
  &:hover {
    background-color: #7A43FF;
  }
`;

function Resource() {
  const { setActiveFQ } = useContext(ActiveFQContext);

  const handlePriceClick = () => {
    setActiveFQ(true);
    window.scrollTo(0, heightToTop(document.getElementById('fq-price')) - 120);
  };

  cardData[0].onClick = handlePriceClick;
  return (
    <SectionWrap id="resources">
      <Typography.Title data-aos="fade-up">Resource</Typography.Title>
      <div data-aos="fade-up">
        <Row gutter={[24, 24]} type="flex" className="!mt-10">
          {cardData.map((item) => (
            <Col xl={6} lg={12} span={24} className="text-center" key={item.title}>
              <CardItem item={item} />
            </Col>
          ))}
        </Row>
      </div>

    </SectionWrap>
  );
}

function CardItem({ item }) {
  const [img, setImg] = useState(item.img);

  const onMouseEnter = () => {
    setImg(item.hoverImg);
  };

  const onMouseLeave = () => {
    setImg(item.img);
  };

  return (
    <StyledCard
      onClick={() => item.onClick && item.onClick()}
      nolinear
      linear="var(--linear-gradient-border-green)"
      className="rounded-[10px] py-6 cursor-pointer bg-my-gray"
      borderWidth={4}
      hover
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Image id="img" src={img} preview={false} width="56px" />
      <Typography.Text className="text-xl block">{item.title}</Typography.Text>
    </StyledCard>
  );
}

export default Resource;
