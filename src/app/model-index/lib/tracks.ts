import { imageData, videoData } from '../data/tracks';
import { text } from './query';
import { createTrack, type Track } from './track';
import { IMAGE_WEIGHTING, VIDEO_WEIGHTING, type Weighting } from './weights';

/**
 * Every track of the index, by the id in its URL. The text track is the
 * original at /model-index; image and video generation are the same
 * machinery over their own snapshots, each with its own Overall.
 */
export interface TrackInfo {
  id: TrackId;
  /** Path under the site, and the base of every link on the track's pages. */
  base: string;
  title: string;
  /** One line under the title. */
  lede: string;
  /** What a model on this track is, for copy: "model", "image model". */
  noun: string;
  weighting: Weighting[];
  index: Track;
}

export type TrackId = 'text' | 'image' | 'video';

const ORIGIN = 'https://publicai.io';

export const image = createTrack({
  data: imageData,
  weighting: IMAGE_WEIGHTING,
  url: `${ORIGIN}/model-index/image`,
  apiBase: `${ORIGIN}/model-index`,
});

export const video = createTrack({
  data: videoData,
  weighting: VIDEO_WEIGHTING,
  url: `${ORIGIN}/model-index/video`,
  apiBase: `${ORIGIN}/model-index`,
});

export const TRACKS: Record<TrackId, TrackInfo> = {
  text: {
    id: 'text',
    base: '/model-index',
    title: 'PublicAI Index',
    lede: 'The LLM benchmark aggregator.',
    noun: 'model',
    weighting: [],
    index: text,
  },
  image: {
    id: 'image',
    base: '/model-index/image',
    title: 'PublicAI Index · Image',
    lede: 'Image generation and editing models, ranked from every blind-vote arena that publishes — none of our own.',
    noun: 'image model',
    weighting: IMAGE_WEIGHTING,
    index: image,
  },
  video: {
    id: 'video',
    base: '/model-index/video',
    title: 'PublicAI Index · Video',
    lede: 'Video generation models, ranked from every blind-vote arena that publishes — none of our own.',
    noun: 'video model',
    weighting: VIDEO_WEIGHTING,
    index: video,
  },
};

export const trackOf = (id: string): TrackInfo | undefined =>
  id === 'image' || id === 'video' || id === 'text' ? TRACKS[id] : undefined;
