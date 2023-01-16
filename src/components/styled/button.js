import styled from 'styled-components';

export const StyledRoundButton = styled.button`
  border-radius: 20px;
  padding: 10px 24px;
  background: var(--color-bg-black-opacity);
  border: 1px solid var(--color-border-white-opacity);
  &:hover{
    background-color: var(--color-border-white-opacity);
  }
`;
