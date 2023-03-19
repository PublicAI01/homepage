import {
  Col, Image, Row, Typography,
} from '@douyinfe/semi-ui';
import { SectionWrap } from './styled';
import resourcePrice from '@/assets/imgs/home/resource-price.png';
import resourceWhitePaper from '@/assets/imgs/home/resource-whitepaper.png';
import resourceDocument from '@/assets/imgs/home/resource-document.png';
import { heightToTop } from '@/utils/utils';
import styled from 'styled-components';

const cardData = [{
  img: resourcePrice,
  title: 'Price',
  onClick: () => {
    window.scrollTo(0, heightToTop(document.querySelector('._fq2')) - 200);
  },
}, {
  img: resourceWhitePaper,
  title: 'White Paper',
  onClick: () => {
    window.open('https://www.markerdao.io/whitepaper.pdf');
  },
}, {
  img: resourceDocument,
  title: 'Development Doc',
  onClick: () => {
    window.open('https://github.com/MarkerDAO');
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
  return (
    <SectionWrap id="resources">
      <Typography.Title>Resource</Typography.Title>
      <Row gutter={[24, 24]} type="flex" className="!mt-10">
        {cardData.map((item) => (
          <Col xl={8} lg={12} span={24} className="text-center" key={item.title}>
            <StyledCard
              onClick={() => item.onClick && item.onClick()}
              nolinear
              linear="var(--linear-gradient-border-green)"
              className="rounded-[10px] py-4 cursor-pointer bg-my-gray"
              borderWidth={4}
              hover
            >
              <Image id="img" src={item.img} preview={false} width="80px" />
              <Typography.Title heading={3} className="text-lg block">{item.title}</Typography.Title>
            </StyledCard>
          </Col>
        ))}
      </Row>

    </SectionWrap>
  );
}

export default Resource;
