import { Typography } from '@douyinfe/semi-ui';
import React, { Suspense, useRef } from 'react';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import sceneCodeUrl from './scene.splinecode?url';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

function Section1() {
  const splineApp = useRef();

  const onLoad = (_splineApp) => {
    splineApp.current = _splineApp;
  };
  return (
    <SectionWrap className="flex items-center min-h-[calc(100vh_-_120px)] xmd:!pt-0" id="home">
      <div className="nmd:w-3/5 relative z-2 xmd:bg-black/40 p-2 xmd:py-24">
        <div>
          <LinearGradientText
            textClassName="text-[128px] leading-none xmd:text-4xl"
            text={<>Collaboration <br />  On-Chain.</>}
          />
        </div>
        <Typography.Paragraph className="text-2xl mt-11">A multi-chain DAO platform to facilitate completion of exceptional AI annotation work and other data services.</Typography.Paragraph>
        <button className="mt-16 bg-button w-[200px] h-[56px] rounded-md hover:opacity-80">
          Get Started
        </button>
      </div>
      <div className="nmd:flex-1 h-[600px] xmd:h-[500px] xmd:absolute xmd:-z-10 xmd:top-20 xmd:left-0 xmd:w-full">
        <div className="w-full h-full rounded-lg overflow-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <Spline onLoad={onLoad} scene={sceneCodeUrl} />
          </Suspense>
        </div>
      </div>
    </SectionWrap>
  );
}

export default Section1;
