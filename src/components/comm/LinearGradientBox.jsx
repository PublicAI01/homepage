import cns from 'classnames';
import styled from 'styled-components';

export const StyledLinearGradientBox = styled.div`
  position: relative;

  &:hover{
    >.gradient{
      background-image: ${(props) => (props.hover && (props.linear || 'var(--linear-gradient-border-purple);'))};
    }
  }

  >.gradient{
    position: absolute;
    top: -${(props) => `${props['border-width']}px`};
    left: -${(props) => `${props['border-width']}px`};
    width: calc(100% + ${(props) => `${props['border-width'] * 2}px`});
    height: calc(100% + ${(props) => `${props['border-width'] * 2}px`});
    border-radius: inherit;
    z-index: -1;
    background-image: ${(props) => (props.nolinear ? '' : (props.linear || 'var(--linear-gradient-border-purple);'))};
  }

`;

function LinearGradientBox(props) {
  const {
    children, className, borderWidth = 1,
  } = props;

  return (
    <StyledLinearGradientBox
      border-width={borderWidth}
      {...props}
      className={cns('bg-black', className)}
    >
      {children}
      {!props.nolinear && <div className="gradient" />}
    </StyledLinearGradientBox>
  );
}

export default LinearGradientBox;
