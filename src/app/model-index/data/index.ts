import raw from './index.json';
import type { IndexData } from './types';

/**
 * Typed view over the generated snapshot. The cast is deliberate: JSON has no
 * literal types, so `metric` arrives as `string`. The pipeline that writes the
 * file validates it against the same schema before opening a PR.
 */
const data = raw as IndexData;

export const { generatedAt, benchmarks, models, scores, excluded, catalogs } =
  data;

export type {
  Access,
  AccessOpenRouter,
  Benchmark,
  Catalog,
  Excluded,
  IndexData,
  Metric,
  Model,
  Score,
} from './types';
