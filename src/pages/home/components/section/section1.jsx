import { Typography } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';

function Section1() {
  return (
    <SectionWrap className="flex items-center">
      <div className="w-3/5">
        <div>
          <LinearGradientText
            textClassName="text-[128px] leading-none"
            text={<>All Work <br />  On-Chain.</>}
          />
        </div>
        <Typography.Paragraph className="text-2xl mt-11">A permissionless protocol to facilitate the exchange of MarkerDAO work, knowledge, and contribution.</Typography.Paragraph>
        <button className="mt-16 bg-button w-[200px] h-[56px] rounded-md hover:opacity-80">
          Get Started
        </button>
      </div>
    </SectionWrap>
  );
}

export default Section1;
