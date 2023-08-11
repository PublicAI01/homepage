import { Toast, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import { StyledIconWrap } from '@/components/layout/Header/styled';
import { platform } from '@/components/layout/Header/config';
import { uri as getStartedArrow } from '@/assets/imgs/arrow/getStartedArrow.svg';
import bgImg from '@/assets/imgs/section1-bg.png';

function Section1() {
  return (
    <div
      className="flex justify-center items-center flex-wrap min-h-[calc(100vh_-_120px)] xmd:!pt-0 !pt-0"
      id="home"
    >
      <img src={bgImg} alt="section1-bg" className="absolute z-0 object-none h-full" />
      <div className="relative z-2 p-2 xmd:py-24 xmd:order-2 text-center" data-aos="fade-up">
        <div className="relative z-10 pointer-events-none">
          <div className="text-[72px] xmd:text-[40px] font-bold max-w-[1200px]">
            Providing 4,000,000,000 Human Jobs in {new Date().getFullYear()}.
          </div>
          <Typography.Paragraph className="text-lg mt-11">A multi-chain DAO platform to facilitate completion of exceptional AI annotation work and other data services.</Typography.Paragraph>
        </div>
        <button
          className="text-center mt-16 bg-button2 w-[200px] h-[56px] rounded-md hover:opacity-80 text-lg font-bold"
          onClick={() => Toast.info('coming soon!')}
        >
          Get Started
          <img src={getStartedArrow} alt="getStartedArrow" className="inline-block ml-4 mb-1" />
        </button>
      </div>
      <StyledIconWrap className="fixed right-5 flex-col z-50 xmd:right-1">
        {platform.map(({ href, com: Com, text }, i) => (
          <a
            className="transform nmd:hover:scale-150 transition-transform relative"
            href={href}
            target="_blank "
            rel="noreferrer"
            key={i}
          >
            <Com
              className="w-[24px] h-[24px] text-[24px] xmd:w-[36px] xmd:h-[36px] xmd:text-[36px] xmd:backdrop-blur-lg rounded-full"
              fill="#D7D7D7"
            />
            <p className="hidden absolute -left-2 text-sm text-[#D7D7D7] top-1/2 transform -translate-y-1/2 -translate-x-full">{text}</p>
          </a>
        ))}
      </StyledIconWrap>
    </div>
  );
}

export default Section1;
