import { Toast, Typography } from '@douyinfe/semi-ui';
import React, { Suspense, useRef } from 'react';
import styled from 'styled-components';
import { DEVICE } from '@/config/device';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';

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
    <SectionWrap className="flex items-center flex-wrap min-h-[calc(100vh_-_120px)] xmd:!pt-0 !pt-0" id="home">
      <div className="nmd:w-3/5 relative z-2 xmd:bg-black/40 p-2 xmd:py-24 xmd:order-2 xmd:text-center">
        <div className="relative z-10 pointer-events-none">
          <div>
            <LinearGradientText
              textClassName="text-[128px] xmd:!text-[48px]"
              text={<>Collaboration <br />  On-Chain.</>}
            />
          </div>
          <Typography.Paragraph className="text-2xl mt-11">A multi-chain DAO platform to facilitate completion of exceptional AI annotation work and other data services.</Typography.Paragraph>
        </div>
        <button
          className="mt-16 bg-button w-[200px] h-[56px] rounded-md hover:opacity-80"
          onClick={() => Toast.info('coming soon!')}
        >
          Get Started
        </button>
      </div>
      <StyledSplineBox>
        <Suspense fallback={<div>Loading...</div>}>
          <Spline onLoad={onLoad} scene="https://prod.spline.design/RWc0Ma8j0CUcDh0e/scene.splinecode" />
        </Suspense>
      </StyledSplineBox>
    </SectionWrap>
  );
}

export default Section1;
