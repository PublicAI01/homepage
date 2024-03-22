import IOBC from '@/assets/imgs/partners/1.png';
import Foresight from '@/assets/imgs/partners/2.png';
import Solana from '@/assets/imgs/partners/3.png';
import {
  Col, Image, Row, Typography,
} from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { SectionWrap } from './styled';

function Partners() {
  const [partners, setPartners] = useState([]);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const load = async () => {
      const modules = import.meta.glob('../../../../assets/imgs/partners/[a-z].png');
      const all = [];
      for (const path of Object.keys(modules)) {
        all.push(modules[path]());
      }
      setPartners((await Promise.all(all)).map((v) => v?.default));
    };
    const loadMedia = async () => {
      const modules = import.meta.glob('../../../../assets/imgs/partners/[A-Z]_Media.png');
      const all = [];
      for (const path of Object.keys(modules)) {
        all.push(modules[path]());
      }
      setMedia((await Promise.all(all)).map((v) => v?.default));
    };
    load();
    loadMedia();
  }, []);

  return (
    <div className="bg-my-gray-white -mt-1">
      <SectionWrap id="partners">
        <div className="">
          <Typography.Title data-aos="fade-up" className="!mb-10 xmd:!mb-5 xmd:!mt-5 text-black xmd:!text-2xl">Partners</Typography.Title>
          <div data-aos="fade-up">
            <Typography.Text className="font-semibold text-black text-2xl xmd:!text-xl">Trusted by Leading Investors</Typography.Text>
            <Row
              className="!mt-10 xmd:!mt-5"
              gutter={{
                xxl: 115, xl: 115, lg: 16, xs: 16, sm: 16, md: 16,
              }}
            >
              {[IOBC, Foresight, Solana].map((img, i) => (
                <Col key={i} xl={8} lg={12} span={12}>
                  <Image preview={false} src={img} alt={`partners-${i}`} style={{ marginBottom: '1.5rem' }} />
                </Col>
              ))}
            </Row>
            <Typography.Text className="font-semibold text-black text-2xl xmd:!text-xl">Trusted by Leading Partners</Typography.Text>
            <Row
              className="!mt-10 xmd:!mt-5"
              gutter={{
                xxl: 115, xl: 115, lg: 16, xs: 16, sm: 16, md: 16,
              }}
            >
              {partners.map((img, i) => (
                <Col key={i} xl={8} lg={12} span={12}>
                  <Image preview={false} src={img} alt={`partners-${i}`} style={{ marginBottom: '1.5rem' }} />
                </Col>
              ))}
            </Row>
            <Typography.Text className="font-semibold text-black text-2xl xmd:!text-xl">Featured by Leading Media</Typography.Text>
            <Row
              className="!mt-10 xmd:!mt-5"
              gutter={{
                xxl: 115, xl: 115, lg: 16, xs: 16, sm: 16, md: 16,
              }}
            >
              {media.map((img, i) => (
                <Col key={i} xl={8} lg={12} span={12}>
                  <Image preview={false} src={img} alt={`partners-${i}`} style={{ marginBottom: '1.5rem' }} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </SectionWrap>
    </div>
  );
}

export default Partners;
