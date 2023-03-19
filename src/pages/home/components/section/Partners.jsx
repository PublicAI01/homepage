import {
  Col, Image, Row, Typography,
} from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { SectionWrap } from './styled';

function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const load = async () => {
      const modules = import.meta.glob('../../../../assets/imgs/partners//*.png');
      const all = [];
      for (const path of Object.keys(modules)) {
        all.push(modules[path]());
      }
      setPartners((await Promise.all(all)).map((v) => v?.default));
    };
    load();
  }, []);

  return (
    <SectionWrap id="partners" className="bg-[#F8F8F8]">
      <div className="">
        <Typography.Title className="text-black xmd:!text-2xl">Partners</Typography.Title>
        <Row
          gutter={{
            xxl: 115, xl: 115, lg: 16, xs: 16, sm: 16, md: 16,
          }}
          className="!mt-7"
        >
          {partners.map((img, i) => (
            <Col key={i} xl={8} lg={12} span={12}>
              <Image preview={false} src={img} alt={`partners-${i}`} style={{ marginBottom: '1.5rem' }} />
            </Col>
          ))}
        </Row>
      </div>
    </SectionWrap>
  );
}

export default Partners;
