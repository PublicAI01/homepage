import type { Metadata } from 'next';

import ModelPage, { modelMetadata } from '../../../components/model-page';
import { TRACKS } from '../../../lib/tracks';

type Params = { params: Promise<{ id: string }> };

export const generateMetadata = ({ params }: Params): Promise<Metadata> =>
  modelMetadata(TRACKS.video, params);

export default function Page({ params }: Params) {
  return (
    <ModelPage
      track={TRACKS.video}
      params={params}
    />
  );
}
