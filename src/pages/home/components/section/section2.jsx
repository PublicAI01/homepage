import {
  Button, Col, Row, Typography,
} from '@douyinfe/semi-ui';
import { useState } from 'react';
import { LinearGradientCard } from '../LinearGradientCard';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';
import img1 from '@/assets/imgs/linearGradientCard/img1.svg';
import img2 from '@/assets/imgs/linearGradientCard/img2.svg';
import img3 from '@/assets/imgs/linearGradientCard/img3.svg';

function Section2() {
  const [learnMore, setLearnMore] = useState(false);
  return (
    <SectionWrap className="!pt-0">
      <div className="nmd:pl-[200px] mb-16">
        <div className="text-right xmd:text-left">
          <LinearGradientText
            inline
            className="text-right"
            textClassName="text-[48px] leading-none"
            text="Marker DAO"
            showIcon
          />
        </div>
        <Typography.Paragraph className="text-2xl mt-4 text-right xmd:break-all xmd:text-center xmd:hidden">
          MarkerDAO is an open, decentralized platform that connects businesses and individuals with a global network of workers.
          It simplifies the process of outsourcing a wide range of tasks, from data annotation to more complex research.
          This platform allows organizations to tap into the collective skills of a vast,
          structured workforce to enhance data analysis, and speed up the development of machine learning models.
        </Typography.Paragraph>

        <div className="nmd:hidden">
          <Typography.Paragraph className="text-2xl mt-4 text-right xmd:break-all xmd:text-center">
            MarkerDAO is an open, decentralized platform that connects businesses and individuals with a global network of workers.
            <span className={learnMore ? '' : 'hidden'}>
              It simplifies the process of outsourcing a wide range of tasks, from data annotation to more complex research.
              This platform allows organizations to tap into the collective skills of a vast,
              structured workforce to enhance data analysis, and speed up the development of machine learning models.
            </span>
          </Typography.Paragraph>
          <div className="text-center" onClick={() => setLearnMore(!learnMore)}>
            <span className="underline text-[#6F5BEB] mt-1 text-lg font-bold">{learnMore ? 'Less' : 'Learn More'}</span>
          </div>
        </div>
      </div>
      <Row type="flex" gutter={[24, 24]} className="px-[50px] xmd:px-0">
        <Col xl={8} lg={12} span={24}>
          <LinearGradientCard
            className="h-[400px]"
            title="Competitive Workforce"
            text="Without barriers from international banking and central platforms, one can access to the best workers, from anywhere in the world."
            icon={img1}
          />
        </Col>
        <Col xl={8} lg={12} span={24}>
          <LinearGradientCard
            className="h-[400px]"
            title="Quality Control"
            text="Through DAO governance and QC oracle systems, one can rest assured that work will be done with meticulousness."
            icon={img2}
          />
        </Col>
        <Col xl={8} lg={12} span={24}>
          <LinearGradientCard
            className="h-[400px]"
            title="Cost Efficiency"
            text="Via on-chian staking and liability mechanisms, MarkerDAO reduces work/cost redundancy required in traditional platforms."
            icon={img3}
          />
        </Col>
      </Row>
    </SectionWrap>
  );
}

export default Section2;
