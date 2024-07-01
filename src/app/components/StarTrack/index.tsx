import clsx from 'clsx';
import type { CSSProperties, FC } from 'react';

import styles from '@/app/components/StarTrack/StarTrack.module.css';

const StarTrack: FC<{
	className?: string;
	trackSize?: string;
	rotateX?: string;
	rotateY?: string;
	ballSize?: string;
	ballColor?: string;
}> = ({
	className,
	trackSize = '600px',
	rotateX = '75deg',
	rotateY = '160deg',
	ballSize = '1rem',
	ballColor = '#fff',
}) => {
	return (
		<div
			className={clsx(styles.track, className)}
			style={
				{
					'--track-size': trackSize,
					'--rotate-x': rotateX,
					'--rotate-y': rotateY,
				} as CSSProperties
			}>
			<div
				className={styles['ball-container']}
				style={
					{
						'--ball-size': ballSize,
						'--revert-rotate-x': `-${rotateX}`,
					} as CSSProperties
				}>
				<div className={styles['ball']}></div>
				<div
					className={styles['ball-light']}
					style={
						{
							'--ball-color': ballColor,
						} as CSSProperties
					}></div>
			</div>
		</div>
	);
};

export default StarTrack;
