/* eslint no-param-reassign: 1 */
// import { hierarchy as d3Hierarchy } from 'd3-hierarchy';
import {
  binEventsByEntityId,
  getEventUuid,
} from './data-utils';

import {
  TS,
  TS0,
  TS_PREV,
  TS_NEXT,
  EVENT_NAME,
  EVENT_UUID,
} from '../constants';

/*
 * Returns a unique node id for a given (eventId, depth) tuple
 */
export function getNodeId(eventId, depth) {
  return `${eventId}__${depth}`;
}

/*
 * Returns the node corresponding to the passed event and depth
 * Initializes the node if it doesn't already exist
 */
export function getNodeFromEvent(allNodes, eventId, depth) {
  const id = getNodeId(eventId, depth);
  const node = allNodes[id] || { // lazy init
    id,
    parent: null,
    children: {},
    events: {},
    depth,
  };

  return node;
}

/*
 * Parses all events associcated with a single entity/user, building the graph
 * in the process
 */
export function buildNodesFromEntityEvents(events, startIndex, nodes) {
  let depth = 0;
  let index = startIndex;
  let tempNode = null;
  let currNode = null;
  let event;
  let eventId;
  let eventUuid;
  const ts0 = events[index] && events[index][TS];

  // traverse events >= starting index
  while (index < events.length) {
    event = events[index];
    eventId = event[EVENT_NAME];
    eventUuid = getEventUuid(event, index);

    tempNode = getNodeFromEvent(nodes, eventId, depth);
    tempNode.events[eventUuid] = {
      ...event,
      [EVENT_UUID]: eventUuid,
      [TS0]: ts0,
      [TS_PREV]: events[index - 1] && events[index - 1][TS],
      [TS_NEXT]: events[index + 1] && events[index + 1][TS],
    };
    tempNode.parent = currNode && currNode.id;
    if (currNode) currNode.children[tempNode.id] = tempNode;

    currNode = tempNode;
    nodes[currNode.id] = currNode;
    depth += 1;
    index += 1;
  }

  // traverse events < starting index
  currNode = null;
  index = startIndex - 1;
  depth = -1;
  while (index >= 0) {
    event = events[index];
    eventId = event[EVENT_NAME];
    eventUuid = getEventUuid(event, index);

    tempNode = getNodeFromEvent(nodes, eventId, depth);
    tempNode.events[eventUuid] = {
      ...event,
      [EVENT_UUID]: eventUuid,
      [TS0]: ts0,
      [TS_PREV]: events[index - 1] && events[index - 1][TS],
      [TS_NEXT]: events[index + 1] && events[index + 1][TS],
    };
    tempNode.parent = currNode && currNode.id;
    if (currNode) currNode.children[tempNode.id] = tempNode;

    currNode = tempNode;
    nodes[currNode.id] = currNode;
    depth -= 1;
    index -= 1;
  }
}

export function computeElapsedMs(node) {
  let meanElapsedMs = 0; // incremental mean https://math.stackexchange.com/a/106720
  let n = 0;
  if (node.depth === 0) {
    return meanElapsedMs;
  }
  Object.keys(node.events).forEach((eventId) => {
    const event = node.events[eventId];
    const elapsed = event[TS] - event[node.depth > 0 ? TS_PREV : TS_NEXT];
    if (!isNaN(elapsed)) {
      n += 1;
      meanElapsedMs += (elapsed - meanElapsedMs) / n;
    }
  });
  return meanElapsedMs;
}

/*
 * Recursively adds the following attributes to the passed nodes, recurses on node.children
 *
 *  eventCount -- number of events associated with the node
 *  elapsedMs -- mean elapsed ms since the previous event, for all events
 */
export function addMetaDataToNodes(nodes) {
  if (!nodes) return;
  Object.keys(nodes).forEach((id) => {
    const node = nodes[id];
    node.elapsedMs = node.events ? computeElapsedMs(node) : null;
    node.eventCount = Object.keys(node.events || {}).length;
    addMetaDataToNodes(node.children); // recurse
  });
}

export function createRoot(nodes) {
  return {
    id: 'root',
    parent: null,
    depth: null,
    children: Object.keys(nodes)
      .filter(n => nodes[n] && nodes[n].depth === 0)
      .reduce((ret, curr) => {
        ret[curr] = nodes[curr];
        return ret;
      }, {}),
  };
}

/*
 * Parses raw events and builds a graph of 'aggregate' nodes
 */
export function buildGraph(cleanedEvents, getStartIndex = () => 0) {
  const nodes = { filtered: {} };
  const eventsByEntityId = binEventsByEntityId(cleanedEvents);

  Object.keys(eventsByEntityId).forEach((id) => {
    const events = eventsByEntityId[id];
    const initialEventIndex = getStartIndex(events);
    if (initialEventIndex > -1) {
      buildNodesFromEntityEvents(events, initialEventIndex, nodes);
    } else {
      nodes.filtered[id] = events;
    }
  });

  const rootNodes = createRoot(nodes);
  addMetaDataToNodes(rootNodes.children);

  return nodes;
}
