import { Modal } from '@douyinfe/semi-ui';
import {
  useEffect, useImperativeHandle, useState, forwardRef,
} from 'react';

function RefSemiModal(props, ref) {
  const [visibleSelf, setVisibleSelf] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisibleSelf(true),
    close: () => setVisibleSelf(false),
    visible: visibleSelf,
  }), [visibleSelf, setVisibleSelf]);

  useEffect(() => {
    setVisibleSelf(Boolean(props.visible));
  }, [props.visible]);

  return (
    <Modal
      {...props}
      visible={visibleSelf}
      style={{
        '--semi-color-fill-0': 'rgba(0,0,0, 0.1)',
        '--semi-color-bg-2': 'white',
        '--semi-color-text-0': 'black',
        '--semi-color-text-1': 'black',
      }}
      onCancel={() => {
        setVisibleSelf(false);
        props?.onCancel && props.onCancel();
      }}
    />
  );
}

export default forwardRef(RefSemiModal);
