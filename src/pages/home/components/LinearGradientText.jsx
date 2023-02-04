import { Typography } from '@douyinfe/semi-ui';
import cns from 'classnames';
import styled from 'styled-components';
import sphere from '@/assets/imgs/sphere.png';

const GradientTextWrap = styled.div`
  background: var(--linear-gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  >span{
    color: transparent;
  }
`;

function LinearGradientText(props) {
  const {
    text, className, textClassName, showIcon, id,
  } = props;

  return (
    <div className={cns('inline-block relative linear-gradient-text xmd:inline-flex xmd:items-center', className)}>
      { showIcon && <img className="inline w-[98px] xmd:w-[42px]" src={sphere} alt="sphere" />}
      <GradientTextWrap>
        <Typography.Text className={cns('title xmd:text-2xl !leading-[1]', textClassName)} id={id}>{text}</Typography.Text>
      </GradientTextWrap>
    </div>
  );
}

export default LinearGradientText;
