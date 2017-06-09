/* eslint no-param-reassign: 1 */
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
  EVENT_COUNT,
  ELAPSED_MS,
  ELAPSED_MS_ROOT,
} from '../constants';

/*
 * Returns a unique node id for a given (eventName, depth) tuple
 */
export function getNodeId(eventName, depth) {
  return `${eventName}__${depth}`;
}

/*
 * Returns the node corresponding to the passed event and depth
 * Initializes the node if it doesn't already exist
 */
export function getNodeFromEvent(allNodes, id, eventName, depth) {
  // const id = getNodeId(eventName, depth);
  const node = allNodes[id] || { // lazy init
    id,
    name: eventName,
    parent: null,
    children: {},
    events: {},
    depth,
    [EVENT_COUNT]: 0,
  };

  return node;
}

/*
 * Parses all events associcated with a single entity/user, building the graph
 * in the process
 */
export function buildNodesFromEntityEvents(events, startIndex, nodes) {
  // @todo refactor this to be more DRY
  let depth = 0;
  let index = startIndex;
  let firstNode = null;
  let tempNode = null;
  let currNode = null;
  let event;
  let eventName;
  let eventUuid;
  const ts0 = events[startIndex] && events[startIndex][TS];
  let nodeId = '';

  // traverse events >= starting index
  while (index < events.length) {
    event = events[index];
    eventName = event[EVENT_NAME];
    eventUuid = getEventUuid(event, index);
    nodeId += eventName;

    tempNode = getNodeFromEvent(nodes, nodeId, eventName, depth);
    tempNode.events[eventUuid] = {
      ...event,
      [EVENT_UUID]: eventUuid,
      [TS0]: ts0,
      [TS_PREV]: events[index - 1] && events[index - 1][TS],
      [TS_NEXT]: events[index + 1] && events[index + 1][TS],
    };
    tempNode.parent = currNode;
    if (currNode) currNode.children[tempNode.id] = tempNode;

    currNode = tempNode;
    firstNode = firstNode || currNode;
    nodes[currNode.id] = currNode;
    depth += 1;
    index += 1;
  }

  // traverse events < starting index
  nodeId = `-${(firstNode && firstNode.id) || ''}`;
  currNode = firstNode;
  index = startIndex - 1;
  depth = -1;
  while (index >= 0) {
    event = events[index];
    eventName = event[EVENT_NAME];
    eventUuid = getEventUuid(event, index);
    nodeId += eventName;

    tempNode = getNodeFromEvent(nodes, nodeId, eventName, depth);
    tempNode.events[eventUuid] = {
      ...event,
      [EVENT_UUID]: eventUuid,
      [TS0]: ts0,
      [TS_PREV]: events[index - 1] && events[index - 1][TS],
      [TS_NEXT]: events[index + 1] && events[index + 1][TS],
    };
    tempNode.parent = currNode;
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
 * Recursively adds metadata attributes to the passed nodes, recurses on node.children
 */
export function addMetaDataToNodes(nodes, allNodes) {
  if (!nodes) return;
  Object.keys(nodes).forEach((id) => {
    const node = nodes[id];
    node[EVENT_COUNT] = Object.keys(node.events || {}).length;
    node[ELAPSED_MS] = computeElapsedMs(node);
    node[ELAPSED_MS_ROOT] = node[ELAPSED_MS] +
      (node.parent ? node.parent[ELAPSED_MS_ROOT] : 0);

    addMetaDataToNodes(node.children, allNodes); // recurse
  });
}

export function createRoot(nodes) {
  return {
    name: 'root',
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

export function createLinks(nodes) {
  const links = [];
  Object.keys(nodes).forEach((parentId) => {
    const parent = nodes[parentId];
    if (parent.children) {
      Object.keys(parent.children).forEach((childId) => {
        links.push({ source: parent, target: nodes[childId] });
      });
    }
  });
  return links;
}

/*
 * Parses raw events and builds a graph of 'aggregate' nodes
 */
export function buildGraph(cleanedEvents, getStartIndex = () => 0) {
  const nodes = {};
  const eventsByEntityId = binEventsByEntityId(cleanedEvents);

  let filtered = 0;
  Object.keys(eventsByEntityId).forEach((id) => {
    const events = eventsByEntityId[id];
    const initialEventIndex = getStartIndex(events);
    if (initialEventIndex > -1 && typeof events[initialEventIndex] !== 'undefined') {
      buildNodesFromEntityEvents(events, initialEventIndex, nodes);
    } else {
      filtered += events.length;
    }
  });

  const root = createRoot(nodes);
  addMetaDataToNodes(root.children, nodes);

  const links = createLinks(nodes);

  return {
    root,
    nodes,
    links,
    totalEventCount: cleanedEvents.length,
    filteredEventCount: filtered,
  };
}
