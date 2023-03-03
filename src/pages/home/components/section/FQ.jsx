import { Collapsible, Typography } from '@douyinfe/semi-ui';
import { IconChevronRight } from '@douyinfe/semi-icons';
import { useState } from 'react';
import classNames from 'classnames';
import LinearGradientText from '../LinearGradientText';
import { FQCard, SectionWrap } from './styled';

const cardData = [{
  title: 'Is my data secure with MarkerDAO?',
  // eslint-disable-next-line max-len
  text: <span>Yes, MarkerDAO takes data security and privacy very seriously and has implemented various measures to ensure that customer data is kept safe and secure.  MarkerDAO&apos;s platform is built with multiple layers of security to protect customer data, including encryption of data both in transit and at rest, and access controls to limit who can access the data. We also have strict policies and procedures in place to ensure that the employees and annotators follow best practices for data security and privacy. </span>,

}, {
  title: 'How does pricing work? Can I just pay-as-I-go?',
  // eslint-disable-next-line max-len
  text: <span className="_fq2">  There are two types of service options. If you choose the MarkerDAO marketplace, you can get a free tier that provides a complimentary amount of annotation, and you can pay-as-you-go for anything exceeding that amount. To access additional features, you can upgrade to MarkerDAO Pro for Enterprise capabilities. </span>,
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
        <Typography.Title className="xmd:!text-base" heading={4}>{item.title}</Typography.Title>
        <div className="icon">
          <IconChevronRight className={active ? 'active' : ''} size="large" />
        </div>
      </div>

      <div className={classNames('mr-20 cursor-default', !active && 'mt-0')} onClick={(e) => e.stopPropagation()}>
        <Collapsible isOpen={active} keepDOM>
          <Typography.Text className="mt-2 text-lg block xmd:text-md">{item.text}</Typography.Text>
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
