/* eslint no-param-reassign: 1 */
import { mean as d3Mean } from 'd3-array';

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
    tempNode.events[eventUuid] = event;
    event[EVENT_UUID] = eventUuid;
    event[TS0] = ts0;
    event[TS_PREV] = (events[index - 1] || {})[TS];
    event[TS_NEXT] = (events[index + 1] || {})[TS];
    event[ELAPSED_MS] = depth === 0 ? 0 : (event[TS] - event[TS_PREV]);
    event[ELAPSED_MS_ROOT] = event[TS] - ts0;

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
    tempNode.events[eventUuid] = event;
    event[EVENT_UUID] = eventUuid;
    event[TS0] = ts0;
    event[TS_PREV] = (events[index - 1] || {})[TS];
    event[TS_NEXT] = (events[index + 1] || {})[TS];
    event[ELAPSED_MS] = event[TS] - event[TS_NEXT];
    event[ELAPSED_MS_ROOT] = event[TS] - ts0;

    tempNode.parent = currNode;
    if (currNode) currNode.children[tempNode.id] = tempNode;

    currNode = tempNode;
    nodes[currNode.id] = currNode;
    depth -= 1;
    index -= 1;
  }
}

/*
 * Recursively adds metadata attributes to the passed nodes, recurses on node.children
 */
export function addMetaDataToNodes(nodes, allNodes) {
  if (!nodes) return;
  Object.keys(nodes).forEach((id) => {
    const node = nodes[id];
    node[EVENT_COUNT] = Object.keys(node.events || {}).length;
    node[ELAPSED_MS] = d3Mean(Object.values(node.events || {}), d => d[ELAPSED_MS]);

    /*
     * if you simply compute the mean of ELAPSED_MS_ROOT across all events,
     * leaf nodes may have am ELAPSED_MS_ROOT that is LESS than the leaf's parent node
     * eg parent node has 3 events:
     *    2 with very long elapsed to root + 1 with a shorter value -> long average
     *    if leaf node only includes the event with a shorter value -> less than parent avg
     *
     * building ELAPSED_MS_ROOT from the sum of ELAPSED_MS prevents this
     */
    if (node.parent) {
      node[ELAPSED_MS_ROOT] = node[ELAPSED_MS] + node.parent[ELAPSED_MS_ROOT];
    } else {
      node[ELAPSED_MS_ROOT] = d3Mean(Object.values(node.events || {}), d => d[ELAPSED_MS_ROOT]);
    }

    addMetaDataToNodes(node.children, allNodes); // recurse
  });
}

export function getRoot(nodes) {
  const children = Object.keys(nodes).filter(n => nodes[n] && nodes[n].depth === 0);
  return {
    name: 'root',
    id: 'root',
    parent: null,
    depth: NaN,
    events: {},
    children: children.reduce((ret, curr) => {
      ret[curr] = nodes[curr];
      return ret;
    }, {}),
  };
}

/*
 * Parses raw events and builds a graph of 'aggregate' nodes
 */
export function buildGraph(cleanedEvents, getStartIndex = () => 0) {
  console.time('buildGraph');
  const nodes = {};
  const entityEvents = binEventsByEntityId(cleanedEvents);

  let filtered = 0;
  Object.keys(entityEvents).forEach((id) => {
    const events = entityEvents[id];
    const initialEventIndex = getStartIndex(events);
    entityEvents[id].zeroIndex = initialEventIndex;
    if (initialEventIndex > -1 && typeof events[initialEventIndex] !== 'undefined') {
      buildNodesFromEntityEvents(events, initialEventIndex, nodes);
    } else {
      filtered += events.length;
    }
  });

  const root = getRoot(nodes);
  addMetaDataToNodes(root.children, nodes);

  root[EVENT_COUNT] = Object.keys(root.children)
    .reduce((sum, curr) => sum + nodes[curr][EVENT_COUNT], 0);

  console.timeEnd('buildGraph');
  return {
    root,
    nodes,
    entityEvents,
    filtered,
  };
}

/*
 * Given a node, returns an array of ancestors from the root to the node
 */
export function ancestorsFromNode(node) {
  let curr = node;
  const ancestors = [];
  while (curr) {
    ancestors.push(curr);
    curr = curr.parent;
  }
  return ancestors.reverse();
}
