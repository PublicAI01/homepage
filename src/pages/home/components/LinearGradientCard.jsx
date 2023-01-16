import styled from 'styled-components';
import cns from 'classnames';

export function LinearGradientCard(params) {
  const {
    text, title, icon, border, className,
  } = params;

  const CardWrapper = styled.div`
    color: white;
    box-sizing: border-box;
    padding: 3px;
    background-image: ${border};
    border-radius: 8px;
  `;

  const SplitLine = styled.div`
    border: 1px solid;
    border-image: ${border} 2;
  `;

  return (
    <CardWrapper className={cns(className)}>
      <div className="rounded-[8px] w-full h-full bg-black p-3 text-center">
        <div>{title}</div>
        <SplitLine className="w-[50px] h-[1px] relative left-1/2 translate-x-right-1/2" />
        <div>{text}</div>
      </div>
    </CardWrapper>
  );
}
