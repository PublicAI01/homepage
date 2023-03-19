import { Toast, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import { StyledIconWrap } from '@/components/layout/Header/styled';
import { platform } from '@/components/layout/Header/config';
import getStartedArrow from '@/assets/imgs/arrow/getStartedArrow.svg';

function Section1() {
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
      <StyledIconWrap className="xmd:!hidden fixed right-5 flex-col z-50">
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
