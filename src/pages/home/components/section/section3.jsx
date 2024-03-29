import img1 from '@/assets/imgs/howItWorks/img1.png';
import img2 from '@/assets/imgs/howItWorks/img2.png';
import img3 from '@/assets/imgs/howItWorks/img3.png';
import {
  Col, Layout, Row, Typography,
} from '@douyinfe/semi-ui';
import styled from 'styled-components';
import { SectionWrap } from './styled';

import Fragile1_IMG from '@/assets/imgs/Fragile/Fragile1.png';
import Fragile2_IMG from '@/assets/imgs/Fragile/Fragile2.png';
import Fragile3_IMG from '@/assets/imgs/Fragile/Fragile3.png';
import PCL from '@/assets/imgs/PCL.svg';
import RF from '@/assets/imgs/RF.svg';
import leftArrow from '@/assets/imgs/arrow/leftArrow.png';
import rightArrow from '@/assets/imgs/arrow/rightArrow.png';
import { DEVICE } from '@/config/device';

const ArrowBox = styled.div`

  .arrow {
    width: 140px;
    margin-top: -90px;
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

const StyledFragileWrap = styled.div`
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.03);
  box-shadow: inset 0px 0px 24.7909px rgba(255, 255, 255, 0.05), inset 0px 1.45829px 1.45829px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(17.1349px);
  padding: 24px 60px 24px;
  border-radius: 10px;
  width: 50%;
  /* flex-shrink: 0; */
  @media ${DEVICE.xmd} {
    width: 90%;
    margin: 0 auto;
    padding: 24px 14px 24px;
  }

`;

const StyledSustainableWrap = styled.div`
  background: rgba(255, 255, 255, 0.03);
  box-shadow: inset 0px 0px 24.7909px rgba(255, 255, 255, 0.05), inset 0px 1.45829px 1.45829px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(17.1349px);
  padding: 76px 98px 58px;
  position: relative;
  z-index: 2;
  border-radius: 10px;
  width: 55%;
  /* flex-shrink: 0; */
  /* transform: translateX(-5%); */
  margin-left: -5%;

  @media ${DEVICE.xmd} {
    width: auto;
    margin: 0;
    margin-top: -20px;
    padding: 50px 40px 34px;
  }

`;

function Section3() {
  return (
    <SectionWrap className="xmd:p-3 bg-black" id="how_it_works">
      <Typography.Title data-aos="fade-up">How it works</Typography.Title>
      <Layout.Content data-aos="fade-up" className="xmd:hidden mt-10 flex flex-col items-center">
        <p className="mt-5 mb-2 text-white text-2xl font-bold text-center"><span className="text-[#28CBA6]">P</span>ublicAI <span className="text-[#28CBA6]">C</span>onsensus RLHF <span className="text-[#28CBA6]">L</span>oss Function</p>
        <PCL width="67%" height="100%" />
        <p className="mt-5 mb-2 text-white text-2xl font-bold text-center"><span className="text-[#28CBA6]">R</span>ward Function</p>
        <RF width="32%" height="100%" />
      </Layout.Content>
      <Row type="flex" className="xmd:!mt-4 nmd:!mt-24" data-aos="fade-up">
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
              <Typography.Text>PublicAI Marketplace</Typography.Text>
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

      <div className="nmd:flex items-center mt-[130px] xmd:mt-[30px]" data-aos="fade-up">
        <StyledFragileWrap>
          <div className="flex items-center justify-center img-wrap xmd:justify-between">
            <img className="nmd:w-[150px] xmd:w-[68px]" src={Fragile1_IMG} alt="" />
            <img className="nmd:w-[130px] xmd:w-[58px]" src={Fragile2_IMG} alt="" />
            <img className="nmd:w-[136px] xmd:w-[62px]" src={Fragile3_IMG} alt="" />
          </div>
          <div className="text-center text-white/30">
            <p className="text-[32px] font-bold xmd:text-2xl">Fragile</p>
            <p className="text-xl xmd:text-sm">Void Driven</p>
          </div>
        </StyledFragileWrap>
        <StyledSustainableWrap>
          <div className="text-center">
            <img className="nmd:h-[100px] inline-block xmd:w-[230px] !max-w-none" src="/logo-text.png" alt="logo" />
          </div>
          <div className="text-center mt-3">
            <p className="text-4xl font-bold text-[#FFCE18] xmd:text-2xl">Sustainable</p>
            <p className="text-xl text-white xmd:text-sm">AI Profit Driven</p>
          </div>
        </StyledSustainableWrap>
      </div>
    </SectionWrap>
  );
}

export default Section3;
