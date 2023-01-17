import { Typography } from '@douyinfe/semi-ui';
import { LinearGradientCard } from '../LinearGradientCard';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import img1 from '../../../../assets/imgs/linearGradientCard/img1.svg';
import img2 from '../../../../assets/imgs/linearGradientCard/img2.svg';
import img3 from '../../../../assets/imgs/linearGradientCard/img3.svg';

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
          MarkerDAO is an open, decentralized platform that connects businesses
          and individuals with a global network of remote workers. It simplifies
          the process of outsourcing a wide range of tasks, from simple data
          validation and research to more complex projects such as survey
          participation, content moderation, and more. This platform allows
          organizations to tap into the collective expertise, skills, and
          insights of a vast, distributed workforce to improve their business
          processes, enhance data collection and analysis, and speed up the
          development of machine learning models.
        </Typography.Paragraph>
      </div>
      <div className="px-[50px] flex justify-between mt-16">
        <LinearGradientCard
          className="w-[350px] h-[400px]"
          title="Quality Control"
          text="Without limits of international bank transfers and central
          platforms arbitary barriers, requesters can access to the most competent workforce, anywhere on the globe"
          border="linear-gradient(to right, #CBFF5E, #00E5FF)"
          icon={img1}
        />
        <LinearGradientCard
          className="w-[350px] h-[400px]"
          title="Quality Control"
          text="With worker based DAO governance, and on-chain quality control oracle systems, one can rest assured that the work
          will be done with the
           higest standard."
          border="var(--linear-gradient-text)"
          icon={img2}
        />
        <LinearGradientCard
          className="w-[350px] h-[400px]"
          title="Quality Control"
          text="Based on the on-chian staking and responsibility mechanisms,
          one can rid of the traditional
          redundancy involved in
          central platforms."
          border="linear-gradient(to right, #CBFF5E, #00E5FF)"
          icon={img3}
        />
      </div>
    </SectionWrap>
  );
}

export default Section2;
