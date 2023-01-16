import { forwardRef } from 'react';
import styled from 'styled-components';
import { IconClose } from '@douyinfe/semi-icons';
import { DEVICE } from '@/config/device';
import RefSemiModal from '../RefSemiModal';

const StyledModal = styled(RefSemiModal)`
  @media ${DEVICE.xmd} {
    .semi-modal {
      height: 100vh;
      max-width: 100vw;
      margin: 0;
      >div{
        border-radius: 0;
      }
      .semi-modal-header{
        >h5{
          display: block;
          width: 100%;
          text-align: center;
          >span{
            margin: 0;
          }
        }
        >.semi-button {
          display: none;
        }
      }
      .semi-modal-body{
        overflow: auto;
      }
    }
  }

`;

function AdaptStyleModal(props, ref) {
  return (
    <StyledModal
      ref={ref}
      {...props}
      footer={(
        <div className="nmd:hidden text-center">
          <IconClose
            onClick={() => ref.current.close()}
            className="active:bg-gray-200 text-[30px] border rounded-full p-2 text-[#D9D9D9]"
          />
        </div>
      )}
    />
  );
}

export default forwardRef(AdaptStyleModal);
