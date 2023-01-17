import { Col, Image, Row } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import LinearGradientText from '../LinearGradientText';
import { SectionWrap } from './styled';

function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const load = async () => {
      const modules = import.meta.glob('../../../../assets/imgs/partners/*.png');
      const all = [];
      for (const path of Object.keys(modules)) {
        all.push(modules[path]());
      }
      setPartners((await Promise.all(all)).map((v) => v?.default));
    };
    load();
  }, []);

  return (
    <SectionWrap>
      <div className="text-center">

        <LinearGradientText
          className="text-center"
          textClassName="text-[48px] leading-none"
          text="Partners"
          showIcon
        />

        <Row gutter={[24, 24]} className="!mt-12">
          {partners.map((img, i) => (
            <Col key={i} xl={8} lg={12} span={12}>
              <Image preview={false} src={img} alt={`partners-${i}`} />
            </Col>
          ))}
        </Row>
      </div>
    </SectionWrap>
  );
}

export default Partners;
