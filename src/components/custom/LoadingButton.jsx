import { Button } from '@douyinfe/semi-ui';
import { useState } from 'react';

function LoadingButton(props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    if (props?.onClick) {
      try {
        await props.onClick();
      } catch (error) {

      }
    }
    setLoading(false);
  };

  return <Button {...props} loading={loading} onClick={handleClick} />;
}

export default LoadingButton;
