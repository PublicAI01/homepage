import styled from 'styled-components';
import { Typography } from '@douyinfe/semi-ui';
import { Tweet } from 'react-twitter-widgets';
import { SectionWrap } from './styled';
import RowCardWrap from '@/components/comm/RowCardWrap';
import CardItem from '@/components/comm/RowCardWrap/CardItem';
import B11_IMG from '@/assets/imgs/twitter/b11.png';
import B1_IMG from '@/assets/imgs/twitter/b1.png';
import B2_IMG from '@/assets/imgs/twitter/b2.png';
import B3_IMG from '@/assets/imgs/twitter/b3.png';
import B4_IMG from '@/assets/imgs/twitter/b4.png';
import { DEVICE } from '@/config/device';

const StyledNewsItem = styled.div`
  background: #FFFFFF;
  border-radius: 10px;
  padding: 20px 30px 30px;
  display: flex;
  flex-direction: column;

  @media ${DEVICE.xmd} {
    padding: 20px 20px 30px;
  }


`;
export default function News() {
  // const data = [{
  //   time: 'April 12th',
  //   content: 'We are in Web3 Festival. H02 booth.',
  //   img: B11_IMG,
  // }, {
  //   time: 'April 8th',
  //   content: 'Take a moment to learn about the hottest AI project #PublicAI!@PublicAI_ demo Day comming soon ',
  //   img: B2_IMG,
  // }, {
  //   time: 'April 5th',
  //   content: 'AMA专访http://PublicAI Let\'s embrace AI actively4.7 16:00 UTC+8',
  //   img: B3_IMG,
  // }, {
  //   time: 'March 23rd',
  //   content: 'We are pleasure to announce that #MarkerDAO has been selected by BNB Grant DAO Round 3 Applicants Demo Time: Friday 23rd Mar, 10:00PM (SGT)',
  //   img: B4_IMG,
  // }];

  const tweetIds = [
    '1654384838923939840',
    '1675891271607660544',
    '1668526033111482375',
    '1666794788962840579',
    '1664205220338081792',
  ];

  return (
    <div
      className="bg-[#F8F8F8] text-black -mt-1"
      style={{
        '--semi-color-text-0': 'black',
      }}
    >
      <SectionWrap>
        <Typography.Title data-aos="fade-up">News</Typography.Title>
        <div data-aos="fade-up">
          {/* <RowCardWrap className="mt-5">
            {data.map((item, index) => (
              <CardItem key={index}>
                <StyledNewsItem>
                  <div className="header">
                    <p className="text-base font-bold">{item.time}</p>
                  </div>
                  <div className="mt-5">
                    <Typography.Paragraph>{item.content}</Typography.Paragraph>
                  </div>
                  <div className="mt-auto">
                    <img src={item.img} alt="" />
                  </div>
                </StyledNewsItem>
              </CardItem>
            ))}
          </RowCardWrap> */}

          <RowCardWrap className="mt-5 gap-4 snap-mandatory snap-x">
            {tweetIds.map((id) => (
              <div className="xmd:snap-center w-[370px] xmd:w-full flex-shrink-0" key={id}>
                <Tweet
                  options={{ align: 'center' }}
                  tweetId={id}
                />
              </div>
            ))}
          </RowCardWrap>
        </div>
      </SectionWrap>
    </div>
  );
}
