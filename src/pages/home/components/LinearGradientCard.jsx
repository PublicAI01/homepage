import styled from 'styled-components';
import cns from 'classnames';
import { Typography } from '@douyinfe/semi-ui';

const CardWrapper = styled.div`
  color: white;
  box-sizing: border-box;
  padding: 2px;
  border-radius: 8px;
`;

const SplitLine = styled.div`
  width: 100px;
  background-image: var(--linear-gradient-border-green);
`;

export function LinearGradientCard(params) {
  const {
    text, title, icon, className,
  } = params;

  return (
    <CardWrapper className={cns(className)}>
      <div className="rounded-[8px] w-full h-full bg-black p-3 text-center">
        <div className="h-1/2">
          <div className="w-full h-full">
            <img className="w-full h-full" src={icon} alt="" />
            <Typography.Text className="relative bottom-2/3 text-[24px] font-bold">{title}</Typography.Text>
          </div>
        </div>
        <div className="text-center mb-2">
          <SplitLine className="h-[4px] inline-block" />
        </div>
        <Typography.Paragraph className="text-xl">{text}</Typography.Paragraph>
      </div>
    </CardWrapper>
  );
}
