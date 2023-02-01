import { Typography } from '@douyinfe/semi-ui';
import React, { Suspense, useRef } from 'react';
import styled from 'styled-components';
import { DEVICE } from '@/config/device';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

const StyledSplineBox = styled.div`
  position: absolute;
  z-index: 1;
  width: 70%;
  right: -12%;
  transform: scale(1.5);

  @media ${DEVICE.xmd} {
    height: 500px;
    left: 0;
    right: initial;
    width: 100%;
    top: 100px;
    z-index: -10;
    transform: scale(1.5);
  }

`;

function Section1() {
  const splineApp = useRef();

  const onLoad = (_splineApp) => {
    splineApp.current = _splineApp;
    // _splineApp.setZoom(1.5);
  };
  return (
    <SectionWrap className="flex items-center min-h-[calc(100vh_-_120px)] xmd:!pt-0" id="home">
      <div className="nmd:w-3/5 relative z-2 xmd:bg-black/40 p-2 xmd:py-24">
        <div className="relative z-10 pointer-events-none">
          <div>
            <LinearGradientText
              textClassName="text-[128px] leading-none xmd:text-[48px]"
              text={<>Collaboration <br />  On-Chain.</>}
            />
          </div>
          <Typography.Paragraph className="text-2xl mt-11">A multi-chain DAO platform to facilitate completion of exceptional AI annotation work and other data services.</Typography.Paragraph>
        </div>
        <button className="mt-16 bg-button w-[200px] h-[56px] rounded-md hover:opacity-80">
          Get Started
        </button>
      </div>
      <StyledSplineBox className="nmd:flex-1 h-[600px]">
        <Suspense fallback={<div>Loading...</div>}>
          <Spline onLoad={onLoad} scene="https://prod.spline.design/RWc0Ma8j0CUcDh0e/scene.splinecode" />
        </Suspense>
      </StyledSplineBox>
    </SectionWrap>
  );
}

export default Section1;
