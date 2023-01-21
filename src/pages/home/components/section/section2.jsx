import { Typography } from '@douyinfe/semi-ui';
import { LinearGradientCard } from '../LinearGradientCard';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import img1 from '@/assets/imgs/linearGradientCard/img1.svg';
import img2 from '@/assets/imgs/linearGradientCard/img2.svg';
import img3 from '@/assets/imgs/linearGradientCard/img3.svg';

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
        <Typography.Paragraph className="text-2xl mt-4 text-right">
          MarkerDAO is an open, decentralized platform that connects businesses and individuals with a global network of workers.
          It simplifies the process of outsourcing a wide range of tasks, from data annotation to more complex research.
          This platform allows organizations to tap into the collective skills of a vast,
          structured workforce to enhance data analysis, and speed up the development of machine learning models.
        </Typography.Paragraph>
      </div>
      <div className="px-[50px] flex justify-between mt-16">
        <LinearGradientCard
          className="w-[350px] h-[400px]"
          title="Competitive Workforce"
          text="Without barriers from international banking and central platforms, one can access to the best workers, from anywhere in the world."
          icon={img1}
        />
        <LinearGradientCard
          className="w-[350px] h-[400px]"
          title="Quality Control"
          text="Through DAO governance and QC oracle systems, one can rest assured that work will be done with meticulousness."
          icon={img2}
        />
        <LinearGradientCard
          className="w-[350px] h-[400px]"
          title="Cost Efficiency"
          text="Via on-chian staking and liability mechanisms, MarkerDAO reduces work/cost redundancy required in traditional platforms."
          icon={img3}
        />
      </div>
    </SectionWrap>
  );
}

export default Section2;
