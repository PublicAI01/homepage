import { Typography } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';

function Section2() {
  return (
    <SectionWrap>
      <div className="pl-[200px]">
        <div className="text-right">
          <LinearGradientText
            className="text-right"
            textClassName="text-[48px] leading-none"
            text="Marker DAO"
            showIcon
          />
        </div>
        <Typography.Paragraph className="text-2xl mt-4">
          MarkerDAO is an open, decentralized platform that connects businesses and individuals with a global network of remote workers.
          It simplifies the process of outsourcing a wide range of tasks, from simple data validation and research to more complex projects such as survey participation, content moderation, and more.
          This platform allows organizations to tap into the collective expertise, skills, and insights of a vast,
          distributed workforce to improve their business processes, enhance data collection and analysis,
          and speed up the development of machine learning models.
        </Typography.Paragraph>

      </div>
    </SectionWrap>
  );
}

export default Section2;
