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
    text, className, textClassName, showIcon,
  } = props;

  return (
    <div className={cns('inline-block relative', className)}>
      { showIcon && <img className="inline" width="98" src={sphere} alt="sphere" />}
      <GradientTextWrap>
        <Typography.Text className={cns(textClassName)}>{text}</Typography.Text>
      </GradientTextWrap>
    </div>
  );
}

export default LinearGradientText;
