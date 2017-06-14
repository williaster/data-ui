import {
  TS,
  EVENT_NAME,
  ENTITY_ID,
} from '../constants';

function intBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const eventNames = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const startDate = Number(new Date('2017-01-05'));

export function generateEvents({
  user,
  eventCardinality = 5,
  minEvents = 2,
  maxEvents = 20,
  minElapsedMs = 5000,
  maxElapsedMs = 1000 * 60 * 60 * 24, // 1 day
}) {
  const nEvents = intBetween(minEvents, maxEvents);
  const events = [];
  let currDate = startDate;
  for (let i = 0; i < nEvents; i += 1) {
    const elapsedMs = intBetween(minElapsedMs, maxElapsedMs);
    const eventIndex = intBetween(0, eventCardinality);
    const event = eventNames[eventIndex];

    currDate += elapsedMs;

    events.push({
      [ENTITY_ID]: user,
      [TS]: new Date(currDate),
      [EVENT_NAME]: event,
    });
  }
  return events;
}

export function generateEventsForUsers({
  nUsers = 5,
  minEvents = 2,
  maxEvents = 10,
  minElapsedMs = 1000 * 60,
  maxElapsedMs = 1000 * 60 * 60 * 24, // 1 day
  eventCardinality = 5,
}) {
  let allEvents = [];
  const userEvents = {};

  let user;
  for (let i = 0; i < nUsers; i += 1) {
    user = `user${i}`;

    const events = generateEvents({
      user,
      minEvents,
      maxEvents,
      minElapsedMs,
      maxElapsedMs,
      eventCardinality,
    });

    userEvents[user] = events;
    allEvents = allEvents.concat(events);
  }

  return { userEvents, allEvents };
}

export default {
  threeUsers: generateEventsForUsers({ nUsers: 3 }),
  fourUsers: generateEventsForUsers({ nUsers: 4 }),
  fiveUsers: generateEventsForUsers({ nUsers: 5 }),
  tenUsers: generateEventsForUsers({ nUsers: 10 }),
  manyUsers: generateEventsForUsers({ nUsers: 20 }),
  manyEvents: generateEventsForUsers({ minEvents: 5, maxEvents: 30 }),
  manyEventTypes: generateEventsForUsers({ eventCardinality: 15 }),
};
