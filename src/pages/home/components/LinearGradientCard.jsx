import styled from 'styled-components';
import cns from 'classnames';

export function LinearGradientCard(params) {
  const {
    text, title, icon, border, className,
  } = params;

  const CardWrapper = styled.div`
    color: white;
    box-sizing: border-box;
    padding: 2px;
    background-image: ${border};
    border-radius: 8px;
  `;

  const SplitLine = styled.div`
    background-image: ${border};
  `;

  return (
    <CardWrapper className={cns(className)}>
      <div className="rounded-[8px] w-full h-full bg-black p-3 text-center">
        <div className="h-1/2">
          <div className="w-full h-full">
            <img className="w-full h-full" src={icon} alt="" />
            <div className="relative bottom-2/3 text-[24px]">{title}</div>
          </div>
        </div>
        <SplitLine className="w-[150px] h-[4px] relative left-1/2 translate-x-right-1/2 my-4" />
        <div>{text}</div>
      </div>
    </CardWrapper>
  );
}
