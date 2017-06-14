import {
  scaleBand,
  scaleOrdinal,
  scaleLinear,
} from '@vx/scale';

import { extent as d3Extent } from 'd3-array';
import { format } from 'd3-format';

import {
  ENTITY_ID,
  EVENT_COUNT,
  ELAPSED_MS_ROOT,
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
  EVENT_COUNT_SCALE,
  NODE_SEQUENCE_SCALE,
  NODE_COLOR_SCALE,
} from '../constants';

import { colors } from '../theme';

export function computeEntityNameScale(sequences, heightPerEntity = 30) {
  const domain = sequences.map(sequence => sequence[0] && sequence[0][ENTITY_ID]);
  const height = sequences.length * heightPerEntity;

  return scaleBand({
    nice: true,
    clamp: true,
    range: [heightPerEntity, height],
    domain,
  });
}

export function computeTimeScaleForSequences(sequences, width) {
  let domain = null;
  sequences.forEach((sequence) => {
    const [min, max] = d3Extent(sequence, n => n[ELAPSED_MS_ROOT]);
    if (!domain) domain = [min, max];
    domain[0] = Math.min(min, domain[0]);
    domain[1] = Math.max(max, domain[1]);
  });

  return scaleLinear({
    nice: true,
    clamp: true,
    range: [0, width],
    domain,
  });
}

export function computeElapsedTimeScale(nodesArray, width) {
  const domain = d3Extent(nodesArray, n => n[ELAPSED_MS_ROOT]);
  return scaleLinear({
    nice: true,
    clamp: true,
    range: [0, width],
    domain,
  });
}

export function computeEventCountScale(root, height) {
  // The maximum event count should be the sum of events at the root node
  const max = Object.keys(root.children).reduce((result, curr) => (
    result + root.children[curr][EVENT_COUNT]
  ), 0);

  return scaleLinear({
    nice: true,
    clamp: true,
    range: [0, height],
    domain: [0, max],
  });
}

export function computeEventSequenceScale(nodesArray, width) {
  const domain = d3Extent(nodesArray, n => n.depth);
  return scaleLinear({
    nice: true,
    clamp: true,
    range: [0, width],
    domain,
  });
}

export function computeNodeSequenceScale(nodesArray, height) {
  const domain = nodesArray
    .filter(n => typeof n.depth !== 'undefined' && n.depth === 0)
    .map(n => n.id);

  return scaleBand({
    nice: true,
    clamp: true,
    range: [0, height],
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

export const zeroDecimals = format(',.0f');
export const oneDecimal = format(',.1f');
export const twoDecimals = format(',.2f');

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

export function formatInterval(ms, unit) {
  const num = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  switch (unit) {
    case 'second':
      return `${zeroDecimals(num / second)}sec`;
    case 'minute':
      return `${zeroDecimals(num / minute)}min`;
    case 'hour':
      return `${oneDecimal(num / hour)}hr`;
    case 'day':
      return `${oneDecimal(num / day)}d`;
    default:
      return zeroDecimals(num);
  }
}

export function timeUnitFromTimeExtent(extent) {
  const maxMs = Math.max(...(extent.map(Math.abs)));
  if (maxMs / day >= 3) return 'day';
  if (maxMs / hour >= 3) return 'hour';
  if (maxMs / minute >= 3) return 'minute';
  return 'second';
}

export function buildAllScales(graph, width, height) {
  if (!graph || !graph.nodes || !width || !height) return {};
  const nodesArray = Object.keys(graph.nodes).map(k => graph.nodes[k]);

  const timeScale = computeElapsedTimeScale(nodesArray, width);
  const timeUnit = timeUnitFromTimeExtent(timeScale.domain());

  return {
    [ELAPSED_TIME_SCALE]: {
      scale: timeScale,
      accessor: n => n[ELAPSED_MS_ROOT],
      label: 'Elapsed time',
      tickFormat: ms => formatInterval(ms, timeUnit),
      isTimeScale: true,
    },

    [EVENT_SEQUENCE_SCALE]: {
      scale: computeEventSequenceScale(nodesArray, width),
      accessor: n => n.depth,
      label: 'Event number',
    },

    [EVENT_COUNT_SCALE]: {
      scale: computeEventCountScale(graph.root, height),
      accessor: n => n[EVENT_COUNT],
      label: '# Events',
    },

    [NODE_SEQUENCE_SCALE]: {
      scale: computeNodeSequenceScale(nodesArray, height),
      accessor: n => n.id,
      label: 'Node sequence',
    },

    [NODE_COLOR_SCALE]: {
      scale: computeColorScale(nodesArray),
      accessor: n => n.name,
      label: 'Event name',
    },
  };
}
