import img1 from '@/assets/imgs/section2/1.png';
import img2 from '@/assets/imgs/section2/2.png';
import img3 from '@/assets/imgs/section2/3.png';
import {
  Typography,
} from '@douyinfe/semi-ui';
import YouTube from 'react-youtube';
import { SectionWrap } from './styled';

function Card(params) {
  const {
    src, alt, title, text,
  } = params;

  return (
    <div className="flex flex-row bg-black my-4 p-10 xmd:p-3 rounded-md" data-aos="fade-up">
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
        <div data-aos="fade-up">
          <Typography.Title className="text-black text-xl" heading={2}><span className="text-[#7A43FF] text-xl font-normal">About</span> PublicAI</Typography.Title>
          <Typography.Paragraph className="my-7 xmd:my-5 text-black text-lg xmd:text-base">
            PublicAI is a distributed AI network enables every human: contribute to AI and share the benefits that connects businesses and individuals with a global network of workers.
            It simplifies the process of outsourcing a wide range of tasks, from data annotation to more complex research related to AI.
            This platform allows organizations to tap into the collective skills of a vast, structured workforce to enhance data analysis, and speed up the development of machine learning models.
          </Typography.Paragraph>
        </div>
        <div className="pb-6 xmd:pb-0">
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
            text="Via on-chain staking and liability mechanisms, PublicAI reduces work/cost redundancy required in traditional platforms."
          />
        </div>
        <YouTube
          videoId="i0U8uaUrILs"
          className="bg-gray-400 xmd:mb-2 w-full h-[500px] xmd:h-[300px] rounded-md overflow-hidden"
          opts={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    </SectionWrap>
  );
}

export default Section2;
