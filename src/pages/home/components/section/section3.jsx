import styled from 'styled-components';
import { Col, Row, Typography } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import img1 from '@/assets/imgs/howItWorks/img1.png';
import img2 from '@/assets/imgs/howItWorks/img2.png';
import img3 from '@/assets/imgs/howItWorks/img3.png';
import arrowSmall from '@/assets/imgs/home/arrow-small.png';
import leftArrow from '@/assets/imgs/arrow/leftArrow.svg';
import rightArrow from '@/assets/imgs/arrow/rightArrow.svg';
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
      width: 22px;
      margin-left: 32px;
    }
    .semi-typography{
      font-size: 20px;
      max-width: 170px;
      margin-top: 0;
      margin-left: 30px;
    }
    .content-img{
      width: 100px;
    }
  }
`;

function Section3() {
  return (
    <SectionWrap>
      <div className="text-center hot_to_work xmd:text-left">
        <LinearGradientText
          className="text-center"
          textClassName="text-[48px] leading-none"
          text="How it works"
          showIcon
        />
      </div>
      <Row type="flex" gutter={[24, 16]} className="!mt-4">
        <Col xl={8} lg={8} span={24} className="text-center">
          <ArrowBox>
            <div className="nmd:mr-4 xmd:flex items-center xmd:mb-2">
              <img className="content-img" src={img1} alt="" />
              <Typography.Text>Requesters have tasks they need to be completed</Typography.Text>
            </div>
            <img className="arrow xmd:hidden" src={rightArrow} alt="" />
            <img className="arrow nmd:hidden" src={arrowSmall} alt="" />
          </ArrowBox>
        </Col>
        <Col xl={8} lg={8} span={24}>
          <ShadowWrapper className="px-8 py-6 text-center xmd:mx-4 xmd:rounded-[30px]">
            <img className="inline w-[270px] xmd:w-[170px]" src={img2} width="270" alt="" />
            <div className="text-[24px] mt-5">MarkerDAO <br /> Marketplace</div>
          </ShadowWrapper>
        </Col>
        <Col xl={8} lg={8} span={24} className="text-center">
          <ArrowBox>
            <img className="arrow nmd:hidden rotate-180" src={arrowSmall} alt="" />
            <img className="xmd:hidden arrow" src={leftArrow} alt="" />
            <div className="nmd:ml-4 xmd:flex items-center xmd:mt-2">
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
