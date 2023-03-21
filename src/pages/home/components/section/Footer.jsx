import {
  Col, Row, Toast, Typography,
} from '@douyinfe/semi-ui';
import { IconMailStroked1 } from '@douyinfe/semi-icons';
import styled from 'styled-components';
import { SectionWrap } from './styled';
import { heightToTop } from '@/utils/utils';

const TextBox = styled.div`
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
  &+div{
    margin-top: 4px;
  }
  span{
    font-size: 16px;
  }
`;

export function Footer() {
  return (
    <div>
      <SectionWrap>
        <Row type="flex" gutter={[100, 36]}>
          <Col xl={12} lg={24} span={24} className="xmd:text-center nmd:text-left">
            <Typography.Title heading={4}>Quick Links</Typography.Title>
            <div className="mt-8 xmd:mt-4 flex items-center justify-between">
              <TextBox>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">
                  <Typography.Text>Home</Typography.Text>
                </a>
              </TextBox>
              <TextBox
                onClick={() => {
                  window.scrollTo(0, heightToTop(document.querySelector('.how_it_works')) - 200);
                }}
              >
                <Typography.Text>How it works</Typography.Text>
              </TextBox>
              <TextBox onClick={() => Toast.info('contact@markerdao.io')}>
                <Typography.Text>Contact</Typography.Text>
              </TextBox>
            </div>
          </Col>
          <Col xl={8} lg={24} span={24} className="xmd:text-center nmd:text-left">
            <Typography.Title heading={4}>Let&apos;s Talk</Typography.Title>
            <div className="mt-8 xmd:mt-4">
              <div className="inline-flex items-center">
                <IconMailStroked1 size="extra-large" className="mr-2" />
                <Typography.Text copyable>contact@markerdao.io</Typography.Text>
              </div>
            </div>
          </Col>
        </Row>
      </SectionWrap>
      <div className="mt-[50px] xmd:mt-4 bg-my-gray w-screen text-center">
        <Typography.Text className="text-[#7B7B7B]">© 2023 MarkerDAO . All Rights Reserved</Typography.Text>
      </div>
    </div>
  );
}
