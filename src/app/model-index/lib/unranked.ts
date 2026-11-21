import { MIN_OVERALL_WEIGHT } from './aggregate';
import { MIN_SOURCES } from './weights';

/**
 * Why a model has no Overall rank, in the words the model page and its
 * exported card print. One function, because the page used to infer the
 * reason from `measuredWeight` alone: anything other than "part of the
 * scheme measured" read as "only one publisher has scored it" — including
 * the 56 models no Overall board had scored at all, several of which four
 * publishers had measured on domain boards. A false sentence about the
 * index's own method, on the page and in the PNG (2026-11-21).
 *
 * Three ways to miss a place, checked in the order the rule applies
 * (aggregate.ts, `ranked`): nothing that builds the Overall scored it;
 * too little of the scheme measured; too few independent publishers.
 */
export function unrankedReason(m: {
  measuredWeight: number;
  overallPublishers: number;
}): string {
  if (m.measuredWeight <= 0)
    return 'No board that builds the Overall index has scored it';
  if (m.measuredWeight < MIN_OVERALL_WEIGHT)
    return `${Math.round(m.measuredWeight * 100)}% of the Overall’s weighting measured — ${Math.round(MIN_OVERALL_WEIGHT * 100)}% places a model`;
  if (m.overallPublishers < MIN_SOURCES)
    return `Only ${m.overallPublishers === 1 ? 'one publisher' : `${m.overallPublishers} publishers`} among the boards that build the Overall index ${m.overallPublishers === 1 ? 'has' : 'have'} scored it — ${MIN_SOURCES} place a model`;
  return 'Not ranked';
}
