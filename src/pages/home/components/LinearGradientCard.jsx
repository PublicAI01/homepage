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
        <div className="relative">
          <img className="mx-auto w-[240px] h-[240px] object-contain" src={icon} alt="" />
          <Typography.Text className="absolute w-full left-0 top-1/2 text-2xl font-bold xmd:static nmd:-translate-y-1/2">{title}</Typography.Text>
        </div>
        <div className="text-center mb-2">
          <SplitLine className="h-[4px] inline-block" />
        </div>
        <Typography.Paragraph className="text-xl">{text}</Typography.Paragraph>
      </div>
    </CardWrapper>
  );
}
