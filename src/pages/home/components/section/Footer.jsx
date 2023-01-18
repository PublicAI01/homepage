import { Col, Row } from '@douyinfe/semi-ui';
import { IconMailStroked1, IconUserCardPhone, IconMapPin } from '@douyinfe/semi-icons';
import logo from '../../../../assets/imgs/logo.svg';
import ins from '../../../../assets/imgs/links/ins.svg';
import camera from '../../../../assets/imgs/links/camera.svg';
import facebook from '../../../../assets/imgs/links/facebook.svg';
import chat from '../../../../assets/imgs/links/chat.svg';
import { SectionWrap } from './styled';

export function Footer(params) {
  return (
    <SectionWrap>
      <Row type="flex" justify="space-between">
        <Col span={7}>
          <img src={logo} alt="" />
          <div className="mt-4">those who do not know how to pursue pleasure rationally encounter consequences that are</div>
          <div className="mt-4 flex w-1/3 justify-between">
            <img src={ins} alt="" />
            <img src={camera} alt="" />
            <img src={facebook} alt="" />
            <img src={chat} alt="" />
          </div>
        </Col>
        <Col span={3}>
          <div className="text-[20px]">Quick Links</div>
          <div>
            <div className="mt-1">Home</div>
            <div className="mt-1">Overview</div>
            <div className="mt-1">About</div>
            <div className="mt-1">Contact</div>
          </div>
        </Col>
        <Col span={4}>
          <div>Let&apos;s Talk </div>
          <div className="flex mt-4">
            <IconMailStroked1 size="extra-large" className="mr-4" />
            <div>info@markerdao.com</div>
          </div>
          <div className="flex mt-4">
            <IconUserCardPhone size="extra-large" className="mr-4" />
            <div>+86 0755-8888-8888</div>
          </div>
        </Col>
        <Col span={6}>
          <div>Office Address</div>
          <div className="flex mt-4">
            <IconMapPin size="extra-large" className="mr-4" />
            <div>Futian district shenzhen.china</div>
          </div>
        </Col>
      </Row>
    </SectionWrap>
  );
}
