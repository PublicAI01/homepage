import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shimmer(w: number, h: number) {
  return `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;
}

export function toBase64(str: string) {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
}

export function preciseTimeout(callback: () => void, delay: number) {
  const start = performance.now();
  function check(timestamp: number) {
    if (timestamp - start >= delay) {
      callback();
    } else {
      requestAnimationFrame(check);
    }
  }
  requestAnimationFrame(check);
}
