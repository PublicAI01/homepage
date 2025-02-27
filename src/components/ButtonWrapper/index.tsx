import type { CSSProperties } from 'react';

import { BORDER, TITLE_BORDER } from '@/constant/border';

const style: CSSProperties = { backgroundImage: `url(${BORDER})` };
const titleStyle: CSSProperties = { backgroundImage: `url(${TITLE_BORDER})` };

export default { style, titleStyle };
