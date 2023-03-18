import styled from 'styled-components';
import { Col, Row, Typography } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import img1 from '@/assets/imgs/howItWorks/img1.png';
import img2 from '@/assets/imgs/howItWorks/img2.png';
import img3 from '@/assets/imgs/howItWorks/img3.png';
import arrowSmall from '@/assets/imgs/home/arrow-small.png';
import leftArrow from '@/assets/imgs/arrow/leftArrow.png';
import rightArrow from '@/assets/imgs/arrow/rightArrow.png';
import { DEVICE } from '@/config/device';

const ShadowWrapper = styled.div`
  background: rgba(255, 255, 255, 0.03);
  box-shadow: inset 0px 0px 40.5px rgba(255, 255, 255, 0.05), inset 0px 2.38235px 2.38235px rgba(255, 255, 255, 0.15);
`;

const ArrowBox = styled.div`
  
  .arrow {
    width: 140px;
  }
  .semi-typography{
    display: block;
    font-size: 18px;
    margin-top: 24px;
  }

  .content-img{
    display: inline-block;
    width: 200px;
  }
  

  @media ${DEVICE.nmd} {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media ${DEVICE.xmd} {
    .arrow {
      width: 60px;
      margin-left: 20px;
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .semi-typography{
      font-size: 15px;
      max-width: 170px;
      margin-top: 0;
      margin-left: 30px;
      text-align: left
    }
    .content-img{
      width: 100px;
    }
  }
`;

function Section3() {
  return (
    <SectionWrap className="xmd:p-3 bg-black">
      <Typography.Title>How it works</Typography.Title>
      <Row type="flex" className="!mt-24">
        <Col xl={8} lg={8} span={24} className="text-center">
          <ArrowBox>
            <div className="xmd:flex items-center xmd:mb-2">
              <img className="content-img" src={img1} alt="" />
              <Typography.Text>Requesters have tasks they need to be completed</Typography.Text>
            </div>
            <img className="arrow xmd:transform xmd:rotate-90" src={leftArrow} alt="" />
          </ArrowBox>
        </Col>
        <Col xl={8} lg={8} span={24}>
          <ArrowBox>
            <div className="xmd:flex items-center xmd:mb-2">
              <img className="content-img" src={img2} alt="" />
              <Typography.Text>MarkerDAO Marketplace</Typography.Text>
            </div>
          </ArrowBox>
        </Col>
        <Col xl={8} lg={8} span={24} className="text-center">
          <ArrowBox>
            <img className="arrow xmd:transform xmd:rotate-90" src={rightArrow} alt="" />
            <div className="xmd:flex items-center xmd:mt-2">
              <img className="content-img" src={img3} alt="" />
              <Typography.Text>Workers want to earn money and work on interesting tasks</Typography.Text>
            </div>
          </ArrowBox>
        </Col>
      </Row>
    </SectionWrap>
  );
}

export default Section3;
