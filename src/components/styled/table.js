import { Table } from '@douyinfe/semi-ui';
import styled from 'styled-components';

export const StyledSemiTable = styled(Table)`
.semi-table{
  border-spacing: 0 10px !important;
}


.semi-table-row-cell{
  padding: 8px !important;
}

.semi-table-thead{
  th{
    text-align: center !important;
    font-size: 16px;
    font-weight: bold !important;
    color: white !important;
    border-bottom: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  
}

.semi-table-tbody{
  >tr{
    border-radius: 60px;
    overflow: hidden;
    backdrop-filter: blur(15px);
    td{
      text-align: center;
      border-top: 1px solid var(--color-border-white-opacity);
      border-bottom: 1px solid var(--color-border-white-opacity) !important;
      &:first-child{
        margin-left: 2px;
        border-top-left-radius: 60px;
        border-bottom-left-radius: 60px;
        border-left: 1px solid var(--color-border-white-opacity);
      }
      &:last-child{
        margin-right: 2px;
        border-top-right-radius: 60px;
        border-bottom-right-radius: 60px;
        border-right: 1px solid var(--color-border-white-opacity);
      }
    }
  }
}

`;
