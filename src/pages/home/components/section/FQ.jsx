import { Collapsible, Typography } from '@douyinfe/semi-ui';
import { IconChevronRight } from '@douyinfe/semi-icons';
import { useState } from 'react';
import LinearGradientText from '../LinearGradientText';
import { FQCard, SectionWrap } from './styled';

const cardData = [{
  title: 'What is Webflow and why is it the best website builder?',
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
}, {
  title: 'What is your favorite template from BRIX Templates?',
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
}, {
  title: 'How do you clone a Webflow Template from the Showcase?',
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
}, {
  title: 'Why is BRIX Templates the best Webflow agency out there?',
  text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
}];

function FQCardItem({ item }) {
  const [active, setActive] = useState(false);

  return (
    <FQCard>
      <div className="header">
        <Typography.Title heading={4}>{item.title}</Typography.Title>
        <div className="icon" onClick={() => setActive(!active)}>
          <IconChevronRight className={active ? 'active' : ''} size="large" />
        </div>
      </div>

      <div className="mr-20">
        <Collapsible isOpen={active} keepDOM>
          <Typography.Text className="mt-2">{item.text}</Typography.Text>
        </Collapsible>
      </div>

    </FQCard>
  );
}

function FQ() {
  return (
    <SectionWrap>

      <LinearGradientText textClassName="leading-none text-[48px]" text="F&Q" showIcon />

      <div className="cards mt-8">
        {cardData.map((item) => <FQCardItem item={item} key={item.title} />)}
      </div>
    </SectionWrap>
  );
}

export default FQ;
