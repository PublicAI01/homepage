import { Col, Row, Typography } from '@douyinfe/semi-ui';
import { IconMailStroked1, IconUserCardPhone } from '@douyinfe/semi-icons';
import logo from '@/assets/imgs/logo.svg';
import ins from '@/assets/imgs/links/ins.svg';
import camera from '@/assets/imgs/links/camera.svg';
import facebook from '@/assets/imgs/links/facebook.svg';
import chat from '@/assets/imgs/links/chat.svg';
import { SectionWrap } from './styled';

export function Footer() {
  return (
    <SectionWrap>
      <Row type="flex" justify="center">
        <Col span={6}>
          <img src={logo} alt="" />
          {/* <div className="mt-4">those who do not know how to pursue pleasure rationally encounter consequences that are</div> */}
          <div className="mt-4 flex w-1/3 justify-between">
            {/* <img src={camera} alt="" />
            <img src={ins} alt="" />
            <img src={facebook} alt="" />
            <img src={chat} alt="" /> */}
          </div>
        </Col>
        <Col span={4} offset={2}>
          <div className="text-[20px]">Quick Links</div>
          <div>
            <div><Typography.Text className="mt-1">Home</Typography.Text></div>
            <div><Typography.Text className="mt-1">Overview</Typography.Text></div>
            <div><Typography.Text className="mt-1">About</Typography.Text></div>
            <div><Typography.Text className="mt-1">Contact</Typography.Text></div>
          </div>
        </Col>
        <Col span={4} offset={2}>
          <div>Let&apos;s Talk </div>
          <div className="flex mt-4">
            <IconMailStroked1 size="extra-large" className="mr-4" />
            <Typography.Text>info@markerdao.io</Typography.Text>
          </div>
          <div className="flex mt-4">
            <IconUserCardPhone size="extra-large" className="mr-4" />
            <Typography.Text>+852 4639 6923</Typography.Text>
          </div>
        </Col>
        {/* <Col span={6}>
          <div>Office Address</div>
          <div className="flex mt-4">
            <IconMapPin size="extra-large" className="mr-4" />
            <div>Futian district shenzhen.china</div>
          </div>
        </Col> */}
      </Row>
      <div className="text-center mt-[200px]">
        <Typography.Text className="text-[#7B7B7B]">© 2023 MarkerDAO . All Rights Reserved</Typography.Text>
      </div>
    </SectionWrap>
  );
}
