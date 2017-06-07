import {
  TS,
  ENTITY_ID,
  EVENT_NAME,
  META,
} from '../src/constants';

import {
  binEventsByEntityId,
  findNthIndexOfX,
  createEvent,
} from '../src/utils/data-utils';

describe('createEvent', () => {
  const accessors = {
    [TS]: () => 'ts',
    [ENTITY_ID]: () => 'entity id',
    [EVENT_NAME]: () => 'event name',
  };

  test('it should be defined', () => {
    expect(createEvent).toBeDefined();
  });

  test('it should add TS, ENTITY_ID, EVENT_NAME, META keys to the event', () => {
    const e = createEvent({}, accessors);
    [TS, ENTITY_ID, EVENT_NAME, META].forEach((prop) => {
      expect(e).toHaveProperty(prop);
    });
  });

  test('it should assign values using the passed accessor fns', () => {
    const e = createEvent({}, accessors);
    [TS, ENTITY_ID, EVENT_NAME].forEach((prop) => {
      expect(e).toHaveProperty(prop, accessors[prop]());
    });
  });

  test('it should keep all event metadata under the META key', () => {
    const rawEvent = { i: 'am', a: 'raw', event: ['!!!'] };
    const e = createEvent(rawEvent, accessors);
    expect(e[META]).toEqual(rawEvent);
  });
});

describe('binEventsByEntityId', () => {
  const u1 = [{ [ENTITY_ID]: 'u1' }, { [ENTITY_ID]: 'u1' }, { [ENTITY_ID]: 'u1' }];
  const u2 = [{ [ENTITY_ID]: 'u2' }, { [ENTITY_ID]: 'u2' }];
  const u3 = [{ [ENTITY_ID]: 'u3' }];
  const events = [...u1, ...u2, ...u3];

  test('it should be defined', () => {
    expect(binEventsByEntityId).toBeDefined();
  });

  test('it should bin events based on the `ENTITY_ID key`', () => {
    const result = binEventsByEntityId(events);
    expect(Object.keys(result).length).toBe(3);
    expect(result.u1).toEqual(u1);
    expect(result.u2).toEqual(u2);
    expect(result.u3).toEqual(u3);
  });
});

describe('findNthIndexOfX', () => {
  const things = [
    { name: 'a' },
    { name: 'a' },
    { name: 'b' },
    { name: 'b' },
    { name: 'c' },
    { name: 'a' },
    { name: 'a' },
  ];

  test('it should be defined', () => {
    expect(findNthIndexOfX).toBeDefined();
  });

  test('it should find the 1st occurrence of an event', () => {
    expect(findNthIndexOfX(things, 1, e => e.name === 'a')).toBe(0);
    expect(findNthIndexOfX(things, 1, e => e.name === 'b')).toBe(2);
    expect(findNthIndexOfX(things, 1, e => e.name === 'c')).toBe(4);
  });

  test('it should find the 2nd occurrence of an event', () => {
    expect(findNthIndexOfX(things, 2, e => e.name === 'a')).toBe(1);
    expect(findNthIndexOfX(things, 2, e => e.name === 'b')).toBe(3);
  });

  test('it should find the last occurrence of an event', () => {
    expect(findNthIndexOfX(things, -1, e => e.name === 'a')).toBe(things.length - 1);
    expect(findNthIndexOfX(things, -1, e => e.name === 'b')).toBe(3);
    expect(findNthIndexOfX(things, -1, e => e.name === 'c')).toBe(4);
  });

  test('it should find the 2nd to last occurrence of an event', () => {
    expect(findNthIndexOfX(things, -2, e => e.name === 'a')).toBe(things.length - 2);
    expect(findNthIndexOfX(things, -2, e => e.name === 'b')).toBe(2);
  });

  test('it should return -1 if the event is not present', () => {
    expect(findNthIndexOfX(things, -1, e => e.name === 'z')).toBe(-1);
    expect(findNthIndexOfX(things, 10, e => e.name === 'a')).toBe(-1);
    expect(findNthIndexOfX(things, 3, e => e.name === 'b')).toBe(-1);
    expect(findNthIndexOfX(things, 2, e => e.name === 'c')).toBe(-1);
  });

  test('it should return -1 for a zeroth occurrence of an event', () => {
    expect(findNthIndexOfX(things, 0, e => e.name === 'a')).toBe(-1);
  });

  test('it should return -1 for when occurrence is outside of the array length range', () => {
    expect(findNthIndexOfX(things, 10, () => true)).toBe(-1);
    expect(findNthIndexOfX(things, -10, () => true)).toBe(-1);
  });
});
