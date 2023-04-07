import { Collapsible, Typography } from '@douyinfe/semi-ui';
import { IconChevronRight } from '@douyinfe/semi-icons';
import { useContext, useState } from 'react';
import classNames from 'classnames';
import { FQCard, SectionWrap } from './styled';
import ActiveFQContext from '../../ActiveFQContext';

const cardData = [{
  title: 'Is my data secure with Public.AI?',
  // eslint-disable-next-line max-len
  text: <span>Yes, Public.AI takes data security and privacy very seriously and has implemented various measures to ensure that customer data is kept safe and secure.  Public.AI&apos;s platform is built with multiple layers of security to protect customer data, including encryption of data both in transit and at rest, and access controls to limit who can access the data. We also have strict policies and procedures in place to ensure that the employees and annotators follow best practices for data security and privacy. </span>,
  isPriceFQContext: false,
}, {
  title: <span id="fq-price">How does pricing work? Can I just pay-as-I-go?</span>,
  // eslint-disable-next-line max-len
  text: <span>There are two types of service options. If you choose the Public.AI marketplace, you can get a free tier that provides a complimentary amount of annotation, and you can pay-as-you-go for anything exceeding that amount. To access additional features, you can upgrade to Public.AI Pro for Enterprise capabilities. </span>,
  isPriceFQContext: true,
}, {
  title: 'Do I get charged based on the number of annotators / labelers working on my project?',
  // eslint-disable-next-line max-len
  text: 'No! Every service option can come with unlimited annotation team members. You only get charged for the work that your annotators complete.',
  isPriceFQContext: false,
}, {
  title: 'What data types are supported on Public.AI?',
  // eslint-disable-next-line max-len
  text: 'Public.AI V1 will support general image annotation, 2D semantic segmentation, text collection, document transcription, named entity recognition, video playback annotation, and LIDAR (3D) annotation.',
  isPriceFQContext: false,
}];

function FQCardItem({ item, active, setActive }) {
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
      <Typography.Title>FAQ</Typography.Title>
      <div className="cards mt-8">
        {cardData.map((item) => {
          if (item.isPriceFQContext) {
            const { activeFQ, setActiveFQ } = useContext(ActiveFQContext);
            return (<FQCardItem item={item} key={item.title} active={activeFQ} setActive={setActiveFQ} />);
          }
          const [active, setActive] = useState(false);
          return (<FQCardItem item={item} key={item.title} active={active} setActive={setActive} />);
        })}
      </div>
    </SectionWrap>
  );
}

export default FQ;
