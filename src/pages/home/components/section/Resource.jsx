import resourceDocument from '@/assets/imgs/home/resource-document.png';
import resourcePrice from '@/assets/imgs/home/resource-price.png';
import { heightToTop } from '@/utils/utils';
import {
  Col, Image, Row, Typography,
} from '@douyinfe/semi-ui';
import { useContext } from 'react';
import styled from 'styled-components';
import ActiveFQContext from '../../ActiveFQContext';
import { SectionWrap } from './styled';

const cardData = [{
  img: resourcePrice,
  title: 'Price',
},
// {
//   img: resourceWhitePaper,
//   title: 'White Paper',
//   onClick: () => {
//     window.open('/whitepaper.pdf');
//   },
// },
{
  img: resourceDocument,
  title: 'Development Doc',
  onClick: () => {
    window.open('https://github.com/PublicAI01');
  },
}];

const StyledCard = styled.div`
  img {
    filter: grayscale(100%);
  }
  &:hover {
    background-color: #7A43FF;
  }
  :hover img{
    filter: grayscale(0);
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
            <Col xl={12} lg={12} span={24} className="text-center" key={item.title}>
              <StyledCard
                onClick={() => item.onClick && item.onClick()}
                nolinear
                linear="var(--linear-gradient-border-green)"
                className="rounded-[10px] py-4 cursor-pointer bg-my-gray"
                borderWidth={4}
                hover
              >
                <Image id="img" src={item.img} preview={false} width="80px" />
                <Typography.Text className="text-xl block">{item.title}</Typography.Text>
              </StyledCard>
            </Col>
          ))}
        </Row>
      </div>

    </SectionWrap>
  );
}

export default Resource;
