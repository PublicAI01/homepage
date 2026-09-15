import imageRaw from './image.json';
import type { IndexData } from './types';
import videoRaw from './video.json';

/**
 * The image and video snapshots, typed the way ./index.ts types the text
 * one. Each is written by the same pipeline from its own boards.
 */
export const imageData = imageRaw as IndexData;
export const videoData = videoRaw as IndexData;
