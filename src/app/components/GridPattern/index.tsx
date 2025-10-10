'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/utils';

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string | number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.2,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: GridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const getPos: () => [number, number] = useCallback(() => {
    if (!dimensions.width || !dimensions.height) return [0, 0];
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }, [dimensions, width, height]);

  const generateSquares = useCallback(
    (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        pos: getPos(),
      })),
    [getPos],
  );

  const [squares, setSquares] = useState<
    { id: number; pos: [number, number] }[]
  >([]);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const id = requestAnimationFrame(() => {
      setSquares(generateSquares(numSquares));
    });
    return () => cancelAnimationFrame(id);
  }, [dimensions, generateSquares, numSquares]);

  const updateSquarePosition = useCallback(
    (id: number) => {
      setSquares((prev) =>
        prev.map((sq) => (sq.id === id ? { ...sq, pos: getPos() } : sq)),
      );
    },
    [getPos],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isClient = typeof window !== 'undefined' && dimensions.width > 0;

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 size-full stroke-white/10',
        className,
      )}
      {...props}>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}>
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id})`}
      />
      {isClient && (
        <svg
          x={x}
          y={y}
          className="overflow-visible">
          {squares.map(({ pos: [sx, sy], id }, index) => (
            <motion.rect
              key={`${id}-${sx}-${sy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: maxOpacity }}
              transition={{
                duration,
                repeat: 1,
                delay: index * 0.1,
                repeatType: 'reverse',
                repeatDelay,
              }}
              onAnimationComplete={() => updateSquarePosition(id)}
              width={width - 1}
              height={height - 1}
              x={sx * width + 1}
              y={sy * height + 1}
              fill="#bfbfbf"
              strokeWidth="0"
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

export default GridPattern;
