import { Toast, Typography } from '@douyinfe/semi-ui';
import React, { Suspense, useRef } from 'react';
import styled from 'styled-components';
import { DEVICE } from '@/config/device';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import getStartedArrow from '@/assets/imgs/arrow/getStartedArrow.svg';
import { StyledIconWrap } from '@/components/layout/Header/styled';
import { platform } from '@/components/layout/Header/config';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

const StyledSplineBox = styled.div`
  position: absolute;
  z-index: 1;
  width: 50%;
  right: -140px;
  height: 500px;
  contain: paint;

  @media ${DEVICE.xmd} {
    margin: auto;
    width: 100%;
    position: static;
    height: 400px;
    width: 100%;
    order: 1;
    >canvas{
      width: 100%;
      height: 100%;
    }
  }

`;

function Section1() {
  const splineApp = useRef();

  const onLoad = (_splineApp) => {
    splineApp.current = _splineApp;
    _splineApp._eventManager.preventScroll = false;
    _splineApp.setZoom(1.2);
  };

  return (
    <div
      className="flex justify-center items-center flex-wrap min-h-[calc(100vh_-_120px)] xmd:!pt-0 !pt-0"
      id="home"
    >
      <img src="./src/assets/imgs/section1-bg.png" alt="section1-bg" className="absolute z-0 object-none h-full" />
      <div className="relative z-2 p-2 xmd:py-24 xmd:order-2 text-center">
        <div className="relative z-10 pointer-events-none">
          <div className="text-6xl xmd:!text-[48px] font-bold">
            Collaboration On-Chain
          </div>
          <Typography.Paragraph className="text-lg mt-11">A multi-chain DAO platform to facilitate completion of exceptional AI annotation work and other data services.</Typography.Paragraph>
        </div>
        <button
          className="text-center mt-16 bg-button w-[200px] h-[56px] rounded-md hover:opacity-80 text-lg font-bold"
          onClick={() => Toast.info('coming soon!')}
        >
          Get Started
          <img src={getStartedArrow} alt="getStartedArrow" className="inline-block ml-4 mb-1" />
        </button>
      </div>
      <StyledIconWrap className="xmd:!hidden fixed right-5 flex-col">
        {platform.map(({ href, com: Com }, i) => (
          <a href={href} target="_blank " rel="noreferrer" key={i}>
            <Com width="24" height="24" fill="white" />
          </a>
        ))}
      </StyledIconWrap>
    </div>
  );
}

export default Section1;
