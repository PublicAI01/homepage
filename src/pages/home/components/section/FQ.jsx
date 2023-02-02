import { Collapsible, Typography } from '@douyinfe/semi-ui';
import { IconChevronRight } from '@douyinfe/semi-icons';
import { useState } from 'react';
import LinearGradientText from '../LinearGradientText';
import { FQCard, SectionWrap } from './styled';

const cardData = [{
  title: 'Is my data secure with MarkerDAO?',
  // eslint-disable-next-line max-len
  text: <> <span>At MarkerDAO, customer security comes first. Learn more about our security and compliance practices here:</span>  <a href="https://markerdao.io/security" target="_blank" rel="noreferrer">https://markerdao.io/security</a>  </>,
}, {
  title: 'How does pricing work? Can I just pay-as-I-go?',
  text:
  <>
    <p>Visit the pricing page (<a href="https://markerdao.io/pricing" target="_blank" rel="noreferrer">https://markerdao.io/pricing</a>) to learn more about our pricing structure.</p>
    {/* eslint-disable-next-line max-len */}
    <p>There are two types of service options. If you choose the MarkerDAO marketplace, you can get a free tier that provides a complimentary amount of annotation, and you can pay-as-you-go for anything exceeding that amount.</p>
    <p>To access additional features, you can upgrade to MarkerDAO Pro for Enterprise capabilities.</p>
  </>,
}, {
  title: 'Do I get charged based on the number of annotators / labelers working on my project?',
  // eslint-disable-next-line max-len
  text: 'No! Every service option can come with unlimited annotation team members. You only get charged for the work that your annotators complete.',
}, {
  title: 'What data types are supported on MarkerDAO?',
  // eslint-disable-next-line max-len
  text: 'MarkerDAO V1 will support general image annotation, 2D semantic segmentation, text collection, document transcription, named entity recognition, video playback annotation, and LIDAR (3D) annotation.',
}];

function FQCardItem({ item }) {
  const [active, setActive] = useState(false);

  return (
    <FQCard onClick={() => setActive(!active)}>
      <div className="header">
        <Typography.Title heading={4}>{item.title}</Typography.Title>
        <div className="icon">
          <IconChevronRight className={active ? 'active' : ''} size="large" />
        </div>
      </div>

      <div className="mr-20 mt-4 cursor-default" onClick={(e) => e.stopPropagation()}>
        <Collapsible isOpen={active} keepDOM>
          <Typography.Text className="mt-2 text-lg">{item.text}</Typography.Text>
        </Collapsible>
      </div>

    </FQCard>
  );
}

function FQ() {
  return (
    <SectionWrap>
      <LinearGradientText textClassName="leading-none text-[48px]" text="FAQ" showIcon />
      <div className="cards mt-8">
        {cardData.map((item) => <FQCardItem item={item} key={item.title} />)}
      </div>
    </SectionWrap>
  );
}

export default FQ;
