import { Typography } from '@douyinfe/semi-ui';
import { SectionWrap } from './styled';
import img1 from '@/assets/imgs/service/1.png';
import img2 from '@/assets/imgs/service/2.png';

const cardData = [{
  title: 'MarkerDAO',
  tagText: 'Market',
  content: 'Publish tasks to access our on-demand 24/7 global workforce; or work on the tasks in the marketplace.',
  bgColor: '#7A43FF',
  img: img1,
}, {
  title: 'MarkerDAO',
  tagText: 'Pro',
  content: 'Contact the MakerDAO Pro team, and get a professional team of experts tailored for your specific task requirements.',
  bgColor: '#FFCE18',
  img: img2,
}];

function Service() {
  return (
    <SectionWrap id="services">
      <Typography.Title>Service</Typography.Title>
      <div className="flex nmd:flex-row xmd:flex-col mt-10 gap-7">
        {cardData.map((item) => (
          <div className="rounded-md box-border p-10 bg-[#18191E]">
            <div className="flex flex-row gap-4">
              <div>
                <Typography.Title heading={2}>
                  <span>{item.title} </span>
                  <span className={`box-border bg-[${item.bgColor}] py-1 px-2 text-black rounded-md`}>{item.tagText}</span>
                </Typography.Title>
                <Typography.Paragraph className="mt-5">{item.content}</Typography.Paragraph>
              </div>
              <img src={item.img} alt="" className="w-1/4 object-contain" />
            </div>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

export default Service;
