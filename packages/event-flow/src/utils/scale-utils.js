import {
  scaleBand,
  scaleOrdinal,
  scaleLinear,
} from '@vx/scale';

import { extent as d3Extent } from 'd3-array';
import { format } from 'd3-format';

import {
  ELAPSED_MS_ROOT,
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
  EVENT_COUNT_SCALE,
  NODE_SEQUENCE_SCALE,
  NODE_COLOR_SCALE,
} from '../constants';

import { colors } from '../theme';

export function computeElapsedTimeScale(nodesArray, width) {
  const domain = d3Extent(nodesArray, n => n[ELAPSED_MS_ROOT]);
  return scaleLinear({
    nice: true,
    range: [0, width],
    domain,
  });
}

export function computeEventCountScale(totalCount, height) {
  return scaleLinear({
    nice: true,
    range: [0, height],
    domain: [0, totalCount],
  });
}

export function computeEventSequenceScale(nodesArray, width) {
  const domain = d3Extent(nodesArray, n => n.depth);
  return scaleBand({
    nice: true,
    rangeBand: [0, width],
    domain,
  });
}

export function computeNodeSequenceScale(nodesArray, height) {
  const domain = nodesArray
    .filter(n => typeof n.depth !== 'undefined' && n.depth === 0)
    .map(n => n.id);

  return scaleBand({
    nice: true,
    rangeBand: [0, height],
    domain,
  });
}

export function computeColorScale(nodesArray) {
  const domain = [];
  nodesArray.forEach((node) => {
    domain.push(node.name);
  });

  return scaleOrdinal({
    range: colors.categories,
    domain,
  });
}

export function buildAllScales(graph, width, height) {
  if (!graph || !graph.nodes || !width || !height) return {};
  const nodesArray = Object.keys(graph.nodes).map(k => graph.nodes[k]);
  return {
    [ELAPSED_TIME_SCALE]: computeElapsedTimeScale(nodesArray, width),
    [EVENT_SEQUENCE_SCALE]: computeEventSequenceScale(nodesArray, width),
    [EVENT_COUNT_SCALE]: computeEventCountScale(graph.totalEventCount, height),
    [NODE_SEQUENCE_SCALE]: computeNodeSequenceScale(nodesArray, height),
    [NODE_COLOR_SCALE]: computeColorScale(nodesArray),
  };
}

export function numTicksForHeight(height) {
  if (height <= 300) return 3;
  if (height <= 600) return 5;
  return 6;
}

export function numTicksForWidth(width) {
  if (width <= 300) return 3;
  if (width <= 400) return 5;
  return 6;
}

const zeroDec = format(',.0f');
const oneDec = format(',.1f');

export function formatInterval(ms, unit) {
  const num = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  switch (unit) {
    case 'second':
      return `${zeroDec(num / 1000)}s`;
    case 'minute':
      return `${zeroDec(num / 1000 / 60)}m`;
    case 'hour':
      return `${oneDec(num / 1000 / 60 / 60)}h`;
    case 'day':
      return `${oneDec(num / 1000 / 60 / 60 / 24)}d`;
    default:
      return zeroDec(num);
  }
}
