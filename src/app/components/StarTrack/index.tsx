import styles from '@/app/components/StarTrack/StarTrack.module.css';
import { cn } from '@/utils';

const StarTrack = (props: React.ComponentProps<'div'>) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn('aspect-square', className)}
      {...rest}
      aria-hidden>
      <div
        className={cn(
          'to-primary absolute inset-0 rounded-full bg-linear-45 from-white via-[#3a3a3a] p-0.5 transform-3d',
          styles.track,
          styles['track-animation'],
          'will-change-transform',
        )}></div>
      <div
        className={cn(
          'absolute inset-0 rounded-full',
          styles['track-animation'],
        )}>
        <div
          className={cn(
            'absolute top-0 left-1/2 aspect-square w-2 -translate-1/2 rounded-full bg-white transform-3d md:w-4',
            styles['ball-animation'],
          )}></div>
      </div>
    </div>
  );
};

export default StarTrack;
