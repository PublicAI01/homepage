import {
  Col, Row, Toast, Typography,
} from '@douyinfe/semi-ui';
import { IconMailStroked1 } from '@douyinfe/semi-icons';
import styled from 'styled-components';
import logo from '@/assets/imgs/logo.svg';
import { SectionWrap } from './styled';
import { heightToTop } from '@/utils/utils';
import { platform } from '@/components/layout/Header/config';
import LinearGradientText from '../LinearGradientText';

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
    <SectionWrap>
      <Row type="flex" gutter={[24, 24]} justify="center">
        <Col xl={8} lg={8} span={24}>
          <img className="inline-block" src={logo} alt="" />
          <div className="mt-8">
            <div>
              <LinearGradientText
                textClassName="text-[24px]"
                text="CollaborationOn-Chain."
              />
            </div>
            <div className="inline-flex items-center gap-2 mt-8">
              {platform.map(({ href, com: Com }, i) => (
                <a href={href} target="_blank " rel="noreferrer" key={i}>
                  <Com className="hover:fill-white/80" width="24" height="24" fill="white" />
                </a>
              ))}
            </div>
          </div>
        </Col>
        <Col xl={8} lg={8} span={24} className="text-left">
          <Typography.Title heading={4}>Quick Links</Typography.Title>
          <div className="mt-8 xmd:mt-4 xmd:flex items-center justify-between">
            <TextBox>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#">
                <Typography.Text>Home</Typography.Text>
              </a>
            </TextBox>
            <TextBox
              onClick={() => {
                window.scrollTo(0, heightToTop(document.querySelector('.hot_to_work')) - 200);
              }}
            >
              <Typography.Text>How it works</Typography.Text>
            </TextBox>
            <TextBox onClick={() => Toast.info('contact@markerdao.io')}>
              <Typography.Text>Contact</Typography.Text>
            </TextBox>
          </div>
        </Col>
        <Col xl={8} lg={8} span={24} className="text-left">
          <Typography.Title heading={4}>Let&apos;s Talk</Typography.Title>
          <div className="mt-8 xmd:mt-4">
            <div className="inline-flex items-center">
              <IconMailStroked1 size="extra-large" className="mr-2" />
              <Typography.Text>contact@markerdao.io</Typography.Text>
            </div>
          </div>
        </Col>
      </Row>
      <div className="mt-[100px] xmd:mt-4">
        <Typography.Text className="text-[#7B7B7B]">© 2023 MarkerDAO . All Rights Reserved</Typography.Text>
      </div>
    </SectionWrap>
  );
}
