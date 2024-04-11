import Builders from '@/assets/imgs/resource/builders_icon.png';
import DatasetSize from '@/assets/imgs/resource/dataset_size_icon.png';
import Partners from '@/assets/imgs/resource/partners_icon.png';
import Validators from '@/assets/imgs/resource/validators_icon.png';
import Workers from '@/assets/imgs/resource/workers_icon.png';
import styled from 'styled-components';
import { SectionWrap } from './styled';

const data = [
  {
    icon: Workers,
    title: 'Workers',
    content: '400K+',
  },
  {
    icon: Validators,
    title: 'Validators',
    content: '300K+',
  },
  {
    icon: Builders,
    title: 'Builders',
    content: '200K+',
  },
  {
    icon: DatasetSize,
    title: 'DatasetSize',
    content: '100T+',
  },
  {
    icon: Partners,
    title: 'Partners',
    content: '50+',
  },
];

const CardGroupWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  .card-item {
    box-sizing: border-box;
  }

  @media screen and (max-width: 992px) {
    .card-item {
      width: 100%;
    }
  }

  @media screen and (min-width: 993px) and (max-width: 1200px)  {
    .card-item {
      width: calc((100% - 40px) / 3);
    }
  }

  @media screen and (min-width: 1201px) {
    .card-item {
      width: calc(20% - 16px);
    }
  }
`;

function PlatformData() {
  return (
    <SectionWrap id="resources2">
      <div data-aos="fade-up">
        <CardGroupWrapper className="mt-10">
          {data.map((item) => (
            <CardItem key={item.title} item={item} />
          ))}
        </CardGroupWrapper>
      </div>
    </SectionWrap>
  );
}

function CardItem({ item }) {
  return (
    <div
      className="card-item flex flex-col items-start p-5 pt-11 rounded-xl border border-white/5"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.06) 100%)',
      }}
    >
      <img className="w-auto h-7 object-contain" src={item.icon} alt="icon" />
      <p className="mt-4 mb-2.5 text-4xl font-bold text-white">{item.content}</p>
      <p className="text-white text-base font-normal">{item.title}</p>
    </div>
  );
}

export default PlatformData;
