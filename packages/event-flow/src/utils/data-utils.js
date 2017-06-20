import {
  TS,
  ENTITY_ID,
  EVENT_NAME,
  META,
} from '../constants';

/*
 * Creates an event with standard shape from a raw record/event object
 */
export function createEvent(rawEvent, accessors) {
  return {
    [TS]: accessors[TS](rawEvent),
    [EVENT_NAME]: accessors[EVENT_NAME](rawEvent),
    [ENTITY_ID]: accessors[ENTITY_ID](rawEvent),
    [META]: {
      ...rawEvent,
    },
  };
}

/*
 * Returns a unique node id for a given (eventId, depth) tuple
 */
export function getEventUuid(event, index) {
  return `${event[EVENT_NAME]}__${index}__${event[ENTITY_ID]}`;
}

/*
 * Event comparator for sorting events
 */
function eventSortComparator(a, b) {
  return a[TS] - b[TS];
}

/*
 * Bins events by entity Id.
 */
export function binEventsByEntityId(events) {
  const eventsByEntityId = {};

  events.forEach((event) => {
    const id = event[ENTITY_ID];
    eventsByEntityId[id] = eventsByEntityId[id] || [];
    eventsByEntityId[id].push({ ...event });
  });

  return eventsByEntityId;
}

/*
 * Maps raw events to a consistent shape and sorts them by TS
 *
 * Accessors should be an object with the following shape:
 *  {
 *   [TS]: fn(e) => date, the ts of the event
 *   [EVENT_NAME]: fn(e) => name,
 *   [ENTITY_ID]: fn(e) => id,
 *  }
 */
export function cleanEvents(rawEvents, accessors) {
  return rawEvents
    .map(event => createEvent(event, accessors))
    .sort(eventSortComparator);
}

/*
 * Returns the index for the Nth occurence (1-index-based)
 * of elements that passes the passed filter fn. If n is negative, will return
 * the index of the Nth occurence relative to the end of the array
 *
 * @param {Array<any>} array, array to find element within
 * @param {number} n, the 1-index based occurrence of the element of interest
 * @param {fn(element) => bool} filter, the function to test if an element matches
 */
export function findNthIndexOfX(array, n = 1, filter) {
  if (n < 0) {
    const revIndex = findNthIndexOfX([...array].reverse(), -n, filter);
    return revIndex === -1 ? -1 : array.length - 1 - revIndex;
  }
  let occurrences = 0;
  return array.findIndex((event) => {
    if (filter(event)) {
      occurrences += 1;
      if (occurrences === n) {
        return true;
      }
      return false;
    }
    return false;
  });
}

/*
 * Given a node, returns all events from all entities included in the node
 */
export function collectSequencesFromNode(node, entityEvents) {
  const entitiesSeen = {};
  const sequences = [];

  if (node && node.events) {
    Object.keys(node.events).forEach((eventId) => {
      const event = node.events[eventId];
      const entityId = event.ENTITY_ID;
      if (!entitiesSeen[entityId]) {
        sequences.push(entityEvents[entityId]);
        entitiesSeen[entityId] = true;
      }
    });
  }

  return sequences;
}
