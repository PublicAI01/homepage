import clsx from 'clsx';
import type { CSSProperties } from 'react';

import styles from '@/components/ButtonWrapper/ButtonWrapper.module.css';
import { BORDER, TITLE_BORDER } from '@/constant/border';

const className = clsx('rounded-lg', styles.wrapper);
const style: CSSProperties = { backgroundImage: `url(${BORDER})` };
const titleStyle: CSSProperties = { backgroundImage: `url(${TITLE_BORDER})` };

export default { className, style, titleStyle };
