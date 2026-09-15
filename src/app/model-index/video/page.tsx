import type { Metadata } from 'next';

import TrackPage from '../components/track-page';
import { TRACKS } from '../lib/tracks';

const track = TRACKS.video;

export const metadata: Metadata = {
  title: 'PublicAI Index · Video',
  description:
    'Video generation models, ranked from every blind-vote arena that publishes. Standardized and weighted by PublicAI; every figure links to its source.',
  alternates: { canonical: track.index.INDEX_URL },
  openGraph: {
    title: 'PublicAI Index · Video',
    description:
      'Video generation models, ranked from every blind-vote arena that publishes. Standardized and weighted by PublicAI; every figure links to its source.',
    url: track.index.INDEX_URL,
    siteName: 'PublicAI',
    type: 'website',
  },
};

export default function Page() {
  return <TrackPage track={track} />;
}
