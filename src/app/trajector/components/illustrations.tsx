/**
 * Line drawings for the three steps. Inline rather than files: they are small,
 * they follow the type colour through `currentColor`, and they carry one
 * accent so the eye reads them as a set rather than as clip art.
 *
 * Each is decorative — the step's heading and copy already say it in words —
 * so they are hidden from assistive technology.
 */
const ACCENT = '#8B5CF6';

const frame = {
  viewBox: '0 0 120 72',
  fill: 'none',
  'aria-hidden': true,
  focusable: 'false',
} as const;

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** A session's turns arriving as a trajectory, tapped in passing by the proxy. */
export const CaptureArt = ({ className }: { className?: string }) => (
  <svg
    {...frame}
    className={className}>
    <path
      {...stroke}
      strokeDasharray="3 4"
      d="M6 52C22 52 26 20 44 20s22 32 40 32"
      opacity={0.5}
    />
    {[
      [6, 52],
      [25, 33],
      [44, 20],
      [64, 30],
      [84, 52],
    ].map(([cx, cy], i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={2.5}
        fill="currentColor"
        opacity={0.75}
      />
    ))}
    <rect
      {...stroke}
      x={92}
      y={22}
      width={22}
      height={28}
      rx={4}
      stroke={ACCENT}
    />
    <path
      {...stroke}
      stroke={ACCENT}
      d="M84 52h8"
    />
    <path
      {...stroke}
      stroke={ACCENT}
      d="M98 31h10M98 36h10M98 41h6"
      opacity={0.85}
    />
  </svg>
);

/** Lines of a captured session, two of them masked, on their way up. */
export const RedactArt = ({ className }: { className?: string }) => (
  <svg
    {...frame}
    className={className}>
    <rect
      {...stroke}
      x={8}
      y={10}
      width={52}
      height={52}
      rx={5}
    />
    <path
      {...stroke}
      d="M17 24h34M17 46h22"
      opacity={0.6}
    />
    <rect
      x={17}
      y={31}
      width={26}
      height={5}
      rx={2}
      fill={ACCENT}
    />
    <rect
      x={17}
      y={38.5}
      width={18}
      height={5}
      rx={2}
      fill={ACCENT}
      opacity={0.65}
    />
    <path
      {...stroke}
      strokeDasharray="3 4"
      d="M64 36h26"
      opacity={0.5}
    />
    <path
      {...stroke}
      stroke={ACCENT}
      d="M104 44V26m0 0-6 6m6-6 6 6"
    />
  </svg>
);

/** Accepted sessions accruing, then claimed. */
export const RewardArt = ({ className }: { className?: string }) => (
  <svg
    {...frame}
    className={className}>
    {[
      [10, 44, 0.35],
      [26, 36, 0.55],
      [42, 26, 0.8],
    ].map(([x, y, o], i) => (
      <rect
        key={i}
        x={x as number}
        y={y as number}
        width={10}
        height={62 - (y as number)}
        rx={2.5}
        fill="currentColor"
        opacity={o as number}
      />
    ))}
    <path
      {...stroke}
      strokeDasharray="3 4"
      d="M58 30h14"
      opacity={0.5}
    />
    <circle
      {...stroke}
      cx={90}
      cy={30}
      r={13}
      stroke={ACCENT}
    />
    <path
      {...stroke}
      stroke={ACCENT}
      d="M90 23v14M86.5 26.5h5.5a2.5 2.5 0 0 1 0 5h-4a2.5 2.5 0 0 0 0 5h5.5"
    />
  </svg>
);

export const stepArt = [CaptureArt, RedactArt, RewardArt];
