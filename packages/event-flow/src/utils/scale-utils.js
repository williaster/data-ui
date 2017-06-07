import {
  scaleBand,
  scaleTime,
  scaleOrdinal,
} from '@vx/scale';

import { extent } from 'd3-array';

import { eventNameFromUuid } from './data-utils';
import { colors } from '../theme';

export function computeTimeScale(graph) {}

export function computeEventCountScale(graph) {}

export function computeEventSequenceScale(graph) {}

export function computeNodeSequenceScale(graph) {}

export function computeColorScale(graph) {
  const domain = [];

  graph.nodes.forEach((node) => {
    const events = Object.keys(node.events);
    events.forEach((uuid) => {
      domain.push(eventNameFromUuid(uuid));
    });
  });

  return scaleOrdinal({
    range: colors.categories,
    domain,
  });
}
