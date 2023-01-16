import { Typography } from '@douyinfe/semi-ui';
import cns from 'classnames';
import styled from 'styled-components';
import sphere from '@/assets/imgs/sphere.png';

const GradientText = styled(Typography.Text)`
  background: linear-gradient(267.96deg, #7A43FF 5.78%, #00FFD1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

function LinearGradientText(props) {
  const {
    text, className, textClassName, showImg,
  } = props;

  return (
    <div className={cns('inline-block relative', className)}>
      { showImg && <img width="98" src={sphere} alt="sphere" />}
      <GradientText className={cns(textClassName)}>
        {text}
      </GradientText>
    </div>
  );
}

export default LinearGradientText;
