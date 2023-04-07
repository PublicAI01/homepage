import {
  Typography,
} from '@douyinfe/semi-ui';
import img1 from '@/assets/imgs/section2/1.png';
import img2 from '@/assets/imgs/section2/2.png';
import img3 from '@/assets/imgs/section2/3.png';
import { SectionWrap } from './styled';

function Card(params) {
  const {
    src, alt, title, text,
  } = params;

  return (
    <div className="flex flex-row bg-black my-4 p-10 xmd:p-3 rounded-md">
      <img src={src} className="h-[80px] my-auto" alt={alt} />
      <div className="ml-5 xmd:ml-2 my-auto">
        <Typography.Title className="nmd:!text-xl xmd:!text-lg">{title}</Typography.Title>
        <Typography.Paragraph className="my-2">
          {text}
        </Typography.Paragraph>
      </div>
    </div>
  );
}

function Section2() {
  return (
    <SectionWrap className="z-10 bg-my-gray-white xmd:p-3">
      <div className="bg-white p-10 xmd:p-2 rounded-md">
        <div>
          <Typography.Title className="text-black text-xl" heading={2}><span className="text-[#7A43FF] text-xl font-normal">About</span> Public.AI</Typography.Title>
          <Typography.Paragraph className="my-7 xmd:my-5 text-black text-lg xmd:text-base">
            Public.AI is an open, decentralized platform that connects businesses and individuals with a global network of workers.
            It simplifies the process of outsourcing a wide range of tasks, from data annotation to more complex research.
            This platform allows organizations to tap into the collective skills of a vast,
            structured workforce to enhance data analysis, and speed up the development of machine learning models.
          </Typography.Paragraph>
        </div>
        <div>
          <Card
            src={img1}
            alt="Competitive Workforce"
            title="Competitive Workforce"
            text="Without barriers from international banking and central platforms, one can access to the best workers, from anywhere in the world."
          />
          <Card
            src={img2}
            alt="Quality Control"
            title="Quality Control"
            text="Through DAO governance and QC oracle systems, one can rest assured that work will be done with meticulousness."
          />
          <Card
            src={img3}
            alt="Cost Efficiency"
            title="Cost Efficiency"
            text="Via on-chain staking and liability mechanisms, Public.AI reduces work/cost redundancy required in traditional platforms."
          />
        </div>
      </div>
    </SectionWrap>
  );
}

export default Section2;
