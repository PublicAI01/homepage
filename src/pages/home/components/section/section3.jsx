import styled from 'styled-components';
import { Col, Row } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import img1 from '@/assets/imgs/howItWorks/img1.png';
import img2 from '@/assets/imgs/howItWorks/img2.png';
import img3 from '@/assets/imgs/howItWorks/img3.png';
import leftArrow from '@/assets/imgs/arrow/leftArrow.svg';
import rightArrow from '@/assets/imgs/arrow/rightArrow.svg';

const ShadowWrapper = styled.div`
  background: rgba(255, 255, 255, 0.03);
  box-shadow: inset 0px 0px 40.5px rgba(255, 255, 255, 0.05), inset 0px 2.38235px 2.38235px rgba(255, 255, 255, 0.15);
`;

function Section3() {
  return (
    <SectionWrap>
      <div className="text-center">
        <LinearGradientText
          className="text-center"
          textClassName="text-[48px] leading-none"
          text="HOW IT WORKS"
          showIcon
        />
      </div>
      <Row type="flex" gutter={16} className="mt-16">
        <Col span={6} className="flex flex-col items-center self-center">
          <img src={img1} width="200" alt="" />
          <div className="mt-6 text-[18px]">Requesters have tasks they need to be completed</div>
        </Col>
        <Col className="self-center" span={3}>
          <img src={rightArrow} alt="" />
        </Col>
        <Col span={6}>
          <ShadowWrapper className="px-8 py-6 self-center">
            <img src={img2} width="270" alt="" />
            <div className="text-[24px] mt-5">MarkerDAO <br /> Marketplace</div>
          </ShadowWrapper>
        </Col>
        <Col className="self-center" span={3}>
          <img src={leftArrow} alt="" />
        </Col>
        <Col span={6} className="flex flex-col items-center self-center">
          <img src={img3} width="200" alt="" />
          <div className="mt-6 text-[18px]">Workers want to earn money and work on interesting tasks</div>
        </Col>
      </Row>
    </SectionWrap>
  );
}

export default Section3;