import { data } from '../data';
import { currentId } from './changes';
import { createTrack } from './track';
import { WEIGHTING } from './weights';

/**
 * The text track — the original PublicAI Index. Everything that answered
 * questions about it keeps its name here; the image and video tracks are
 * the same machinery, built in ./tracks.
 */
export const text = createTrack({
  data,
  weighting: WEIGHTING,
  url: 'https://publicai.io/model-index',
  currentId,
});

export const {
  INDEX_URL,
  MCP_URL,
  API_URL,
  resolveScope,
  scopeLabel,
  scopeTotal,
  positionIn,
  rankModels,
  getModel,
  isHeadlineDomain,
  headlineTaxonomy,
  describeIndex,
  modelStandings,
} = text;

export type {
  ModelDetail,
  ModelSummary,
  Peer,
  RankQuery,
  Rival,
  Scope,
  SourceFigure,
  Standing,
  StandingsHit,
  StandingsMiss,
} from './track';
