import { Col, Row, Typography } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap, StyledServiceCard } from './styled';
import bg from '@/assets/imgs/home/service-bg.png';
import bg2 from '@/assets/imgs/home/service-card-bg2.png';

const cardData = [{
  title: 'MarkerDAO',
  tagText: 'Market',
  content: 'Publish tasks to access our on-demand 24/7 global workforce; or work on the tasks in the marketplace.',
}, {
  title: 'MarkerDAO',
  tagText: 'Pro',
  content: 'Contact the MakerDAO Pro team, and get a professional team of experts tailored for your specific task requirements.',
}];

function Service() {
  return (
    <SectionWrap id="services">
      <LinearGradientText
        textClassName="text-[48px] leading-none"
        text="Services"
        showIcon
      />
      <Row type="flex" className="nmd:!mt-10" gutter={[24, 24]}>
        {cardData.map((item, i) => (
          <Col key={item.tagText} xl={12} lg={12} md={12} span={24}>
            <StyledServiceCard gold={i === cardData.length - 1}>
              <div className="content">
                <div className="title-wrap">
                  <Typography.Title heading={1}>{item.title}</Typography.Title>
                  <Typography.Title heading={1}>{item.tagText}</Typography.Title>
                </div>
                <Typography.Paragraph className="nmd:text-3xl xmd:text-sm">{item.content}</Typography.Paragraph>
              </div>
              <img className="bg" src={bg2} alt="" />
            </StyledServiceCard>
          </Col>
        ))}

      </Row>
      <img src={bg} alt="" className="absolute top-[10%] left-0 -z-[1] xmd:hidden" />
    </SectionWrap>
  );
}

export default Service;
