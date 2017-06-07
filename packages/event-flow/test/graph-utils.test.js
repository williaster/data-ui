import {
  TS0,
  TS_PREV,
  TS_NEXT,
  TS,
  EVENT_NAME,
  ENTITY_ID,
} from '../src/constants';

import {
  binEventsByEntityId,
} from '../src/utils/data-utils';

import {
  buildNodesFromEntityEvents,
  buildGraph,
  getNodeFromEvent,
  addMetaDataToNodes,
  createRoot,
} from '../src/utils/graph-utils';

const user1 = [
  { [TS]: new Date('2017-03-22 18:33:10'), [EVENT_NAME]: 'a', [ENTITY_ID]: 'u1' },
  { [TS]: new Date('2017-03-22 18:34:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u1' },
  { [TS]: new Date('2017-03-22 18:35:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u1' },
  { [TS]: new Date('2017-03-22 18:36:10'), [EVENT_NAME]: 'd', [ENTITY_ID]: 'u1' },
];

const user2 = [
  { [TS]: new Date('2017-03-22 18:33:10'), [EVENT_NAME]: 'a', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 18:34:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 18:35:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 18:36:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 18:37:10'), [EVENT_NAME]: 'd', [ENTITY_ID]: 'u2' },
];

describe('binEventsByEntityId', () => {
  test('it should be defined', () => {
    expect(binEventsByEntityId).toBeDefined();
  });

  test('it should return an object', () => {
    expect(typeof binEventsByEntityId([])).toBe('object');
  });

  test('it should return events for each unique entity', () => {
    const result = binEventsByEntityId([
      { [ENTITY_ID]: 1 },
      { [ENTITY_ID]: 1 },
      { [ENTITY_ID]: 2 },
      { [ENTITY_ID]: 4 },
    ]);
    expect(Object.keys(result).length).toBe(3);
  });

  test('it should return an object of arrays', () => {
    const result = binEventsByEntityId([{ [ENTITY_ID]: 1 }, { [ENTITY_ID]: 2 }]);
    expect(Array.isArray(result[1])).toBe(true);
    expect(Array.isArray(result[2])).toBe(true);
  });
});

describe('getNodeFromEvent', () => {
  test('it should be defined', () => {
    expect(getNodeFromEvent).toBeDefined();
  });

  test('it should return an object', () => {
    expect(typeof getNodeFromEvent({}, '123', 0)).toBe('object');
  });

  test('it should not initialize nodes that already exits', () => {
    const nodes = {};
    const node = getNodeFromEvent(nodes, '123', 0);
    nodes[node.id] = node;

    expect(getNodeFromEvent(nodes, '123', 0)).toBe(nodes[node.id]);
    expect(getNodeFromEvent(nodes, '123', 1)).not.toBe(nodes[node.id]);
    expect(getNodeFromEvent(nodes, '1234', 0)).not.toBe(nodes[node.id]);
  });
});

describe('buildNodesFromEntityEvents', () => {
  test('it should be defined', () => {
    expect(buildNodesFromEntityEvents).toBeDefined();
  });

  test('it should parse all events from the first event', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 0, nodes);
    expect(Object.keys(nodes).length).toBe(4);
    expect(Object.keys(nodes)).toEqual(expect.arrayContaining(['a__0', 'b__1', 'c__2', 'd__3']));
  });

  test('it should parse all events from the last event', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 3, nodes);
    expect(Object.keys(nodes).length).toBe(4);
    expect(Object.keys(nodes)).toEqual(expect.arrayContaining(['a__-3', 'b__-2', 'c__-1', 'd__0']));
  });

  test('it should parse all events from an arbitrary event', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 2, nodes);
    expect(Object.keys(nodes).length).toBe(4);
    expect(Object.keys(nodes)).toEqual(expect.arrayContaining(['a__-2', 'b__-1', 'c__0', 'd__1']));
  });

  test('it should create one node for each unique (event name, event index) pair', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 0, nodes);
    expect(Object.keys(nodes).length).toBe(4);
    expect(Object.keys(nodes)).toEqual(expect.arrayContaining(['a__0', 'b__1', 'c__2', 'd__3']));

    buildNodesFromEntityEvents(user1, 3, nodes); // all new indices
    expect(Object.keys(nodes).length).toBe(8);
    expect(Object.keys(nodes)).toEqual(expect.arrayContaining(['a__-3', 'b__-2', 'c__-1', 'd__0']));

    buildNodesFromEntityEvents(user2, 0, nodes); // some overlapping nodes
    expect(Object.keys(nodes).length).toBe(11);
    expect(Object.keys(nodes)).toEqual(expect.arrayContaining(['b__2', 'c__3', 'd__4']));
  });

  test('it should add proper parent and children references', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 0, nodes); // => 'a__0', 'b__1', 'c__2', 'd__3'

    expect(nodes.a__0.parent).toBeFalsy();
    expect(nodes.b__1.parent).toBe('a__0');
    expect(nodes.c__2.parent).toBe('b__1');
    expect(nodes.d__3.parent).toBe('c__2');

    expect(Object.keys(nodes.a__0.children)).toContain('b__1');
    expect(Object.keys(nodes.b__1.children)).toContain('c__2');
    expect(Object.keys(nodes.c__2.children)).toContain('d__3');
    expect(Object.keys(nodes.d__3.children)).toEqual([]);
  });

  test('it should add proper depth attributes', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 2, nodes); // => 'a__-2', 'b__-1', 'c__0', 'd__1'

    expect(nodes['a__-2'].depth).toBe(-2);
    expect(nodes['b__-1'].depth).toBe(-1);
    expect(nodes.c__0.depth).toBe(0);
    expect(nodes.d__1.depth).toBe(1);
  });

  test('it should add event referenecs to nodes', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 0, nodes);

    // @todo don't hard code these
    expect(nodes.a__0.events.a__0__u1).toMatchObject(user1[0]);
    expect(nodes.b__1.events.b__1__u1).toMatchObject(user1[1]);
  });

  test('it should add TS0, TS_NEXT, and TS_PREV properties to events', () => {
    const nodes = {};
    buildNodesFromEntityEvents(user1, 0, nodes);

    ['a__0', 'b__1', 'c__2', 'd__3'].forEach((nodeId) => {
      const eventKeys = Object.keys(nodes[nodeId].events);
      eventKeys.forEach((eventKey) => {
        [TS0, TS_PREV, TS_NEXT].forEach((prop) => {
          const event = nodes[nodeId].events[eventKey];
          expect(event).toHaveProperty(prop);
        });
      });
    });
  });
});

describe('addMetaDataToNodes', () => {
  test('it should be defined', () => {
    expect(addMetaDataToNodes).toBeDefined();
  });

  // @todo
  // validate elapsed times
});

describe('createRoot', () => {
  test('it should be defined', () => {
    expect(createRoot).toBeDefined();
  });

  // @todo
  // validate depth === 0 for all root.children keys
});

describe('buildGraph', () => {
  test('it should be defined', () => {
    expect(buildGraph).toBeDefined();
  });

  test('it should keep a reference to events that are filtered', () => {
    const nodes = buildGraph(user1, () => -1);
    expect(nodes.filtered.u1).toEqual(user1);
  });
});

