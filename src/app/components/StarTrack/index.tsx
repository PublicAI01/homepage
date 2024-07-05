import clsx from 'clsx';
import type { CSSProperties, FC } from 'react';

import styles from '@/app/components/StarTrack/StarTrack.module.css';

const StarTrack: FC<{
  className?: string;
  trackSize?: [string] | [string, string];
  rotateX?: [string] | [string, string];
  rotateY?: [string] | [string, string];
  ballSize?: [string] | [string, string];
  ballColor?: [string] | [string, string];
}> = ({
  className,
  trackSize = ['600px'],
  rotateX = ['75deg'],
  rotateY = ['160deg'],
  ballSize = ['1rem'],
  ballColor = ['#fff'],
}) => {
  return (
    <div
      className={clsx(styles.track, className)}
      style={
        {
          '--track-size-mobile': trackSize[0],
          '--track-size-desktop': trackSize[1] ?? trackSize[0],
          '--rotate-x-mobile': rotateX[0],
          '--rotate-x-desktop': rotateX[1] ?? rotateX[0],
          '--rotate-y-mobile': rotateY[0],
          '--rotate-y-desktop': rotateY[0] ?? rotateY[1],
        } as CSSProperties
      }>
      <div
        className={styles['ball-container']}
        style={
          {
            '--ball-size-mobile': ballSize[0],
            '--ball-size-desktop': ballSize[1] ?? ballSize[0],
            '--revert-rotate-x-mobile': `-${rotateX[0]}`,
            '--revert-rotate-x-desktop': `-${rotateX[1] ?? rotateX[0]}`,
            '--ball-color-mobile': ballColor[0],
            '--ball-color-desktop': ballColor[1] ?? ballColor[0],
          } as CSSProperties
        }>
        <div className={styles['ball']}></div>
        <div className={styles['ball-light']}></div>
      </div>
    </div>
  );
};

export default StarTrack;
