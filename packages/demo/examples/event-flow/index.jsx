import React from 'react';
import { withScreenSize } from '@vx/responsive';
// import { withState, compose } from 'recompose';
// import { withStyles, css } from '../../themes/withStyles';

// import data from './omg_20170605T183803.json';
import data from './test_2.json';

import {
  App,
  // ELAPSED_TIME_SCALE,
  // EVENT_SEQUENCE_SCALE,

  TS,
  EVENT_NAME,
  ENTITY_ID,

  cleanEvents,
  // findNthIndexOfX,
  sampleEvents,

  // Visualization,
} from '@data-ui/event-flow';

// import { Select } from '@data-ui/forms';
// import Step from './Step';


const ResponsiveVis = withScreenSize(({ screenWidth, screenHeight, ...rest }) => (
  <App
    width={screenWidth * 0.9}
    height={screenHeight * 0.9}
    {...rest}
  />
));

// const withAlignment = withState('alignBy', 'setAlignBy', 0);
// const withXScaleSelect = withState('xScaleType', 'setXScale', ELAPSED_TIME_SCALE);
// const withStylesHOC = withStyles(({ font }) => ({
//   container: {
//     ...font.small,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   },

//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: 250,
//     paddingLeft: 8,
//     ...font.small,
//   },
// }));

// const enhancer = compose(withAlignment, withXScaleSelect, withStylesHOC);

const userData = [];

data.forEach((row) => {
  debugger;
  const events = JSON.parse(row.arr_events);

  events.forEach(e => userData.push({
    ...e,
    [TS]: new Date(e.ts_event_formatted),
    [EVENT_NAME]: e.dim_event_type,
    [ENTITY_ID]: row.id_visitor_unique,
  }));

  JSON.parse(row.action_events).forEach(e => userData.push({
    ...e,
    [TS]: new Date(e.ts_event_formatted_min),
    [EVENT_NAME]: e.dim_action_type,
    [ENTITY_ID]: row.id_visitor_unique,
  }));
});

sampleEvents.realData = {
  allEvents: cleanEvents(userData, {
    [TS]: d => d[TS],
    [EVENT_NAME]: d => d[EVENT_NAME],
    [ENTITY_ID]: d => d[ENTITY_ID],
  }),
};

// console.log(sampleEvents)

// const alignByLastAffiliateClick = (events) => (
//   findNthIndexOfX(events, -1, d => (d[EVENT_NAME] === 'affiliate_impression'))
// );

// one example per dataset
const examples = Object.keys(sampleEvents).map((name) => {
  const dataset = sampleEvents[name];

  return {
    description: name,
    example: () => (
      <ResponsiveVis data={dataset.allEvents} />
    ),
  };
});

export default examples;
