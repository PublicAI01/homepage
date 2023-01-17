import { Col, Row, Typography } from '@douyinfe/semi-ui';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap, StyledServiceCard } from './styled';

const cardData = [{
  title: 'MarkerDao',
  tagText: 'Market',
  content: 'Publish tasks to access our on-demand 24/7 global workforce, or work from anywhere in the world.',
}, {
  title: 'MarkerDao',
  tagText: 'Pro',
  content: 'From either MakerDAO or third party providers, you receive a custom plan that is tailored to your specific requirements. ',
}];

function Service() {
  return (
    <SectionWrap>
      <LinearGradientText textClassName="text-[48px] leading-none" text="Service" showIcon />
      <Row className="!mt-10">
        {cardData.map((item) => (
          <Col key={item.tagText} xl={12} lg={12} md={12} span={24}>
            <StyledServiceCard>
              <div className="title-wrap">
                <Typography.Title heading={1}>{item.title}</Typography.Title>
                <Typography.Title heading={1}>{item.tagText}</Typography.Title>
              </div>
              <Typography.Paragraph className="text-3xl">{item.content}</Typography.Paragraph>
            </StyledServiceCard>
          </Col>
        ))}

      </Row>
    </SectionWrap>
  );
}

export default Service;
