import { uri as getStartedArrow } from '@/assets/imgs/arrow/getStartedArrow.svg';
import bgImg from '@/assets/imgs/section1-bg.png';
import { platform } from '@/components/layout/Header/config';
import { StyledIconWrap } from '@/components/layout/Header/styled';
import { Typography } from '@douyinfe/semi-ui';

function Section1() {
  return (
    <div
      className="flex justify-center items-center flex-wrap nmd:h-[calc(100vh_-_88px)] xmd:h-[calc(100vh_-_78px)] xmd:!pt-0 !pt-0 bg-center bg-no-repeat bg-cover"
      id="home"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <div className="relative z-2 p-2 xmd:py-24 xmd:order-2 text-center" data-aos="fade-up">
        <div className="relative z-10 pointer-events-none">
          <div className="text-[72px] xmd:text-[40px] font-bold max-w-[1200px]">
            Web3 AI Data Infrastructure, Create 4 Billion Data Jobs in 2050.
          </div>
          <Typography.Paragraph className="text-lg mt-11">Enable Every Human: Contribute to AI and Share the Benefits.</Typography.Paragraph>
        </div>
        <a
          href="https://beta.publicai.io/"
          rel="noreferrer"
          target="_blank"
          className="text-center mt-16 mx-auto bg-button2 flex items-center justify-center w-[200px] h-[56px] rounded-md hover:opacity-80 text-lg font-bold"
        >
          Launch App
          <img src={getStartedArrow} alt="getStartedArrow" className="inline-block ml-4" />
        </a>
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
