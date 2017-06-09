import React from 'react';
import { withScreenSize } from '@vx/responsive';
import { withState } from 'recompose';
// import data from './omg_20170605T183803.json';

import {
  // TS,
  EVENT_NAME,
  ENTITY_ID,
  sampleEvents,

  VisApp,
} from '@data-ui/event-flow';

import Step from './Step';

const ResponsiveVis = withScreenSize(({ screenWidth, ...rest }) => (
  <VisApp
    width={screenWidth * 0.8}
    height={screenWidth * 0.8 * 0.6}
    {...rest}
  />
));

const withAlignment = withState('alignBy', 'setAlignBy', 0);

// one example per dataset
const examples = Object.keys(sampleEvents).map((name) => {
  const dataset = sampleEvents[name];
  console.log(dataset);
  return {
    description: name,
    example: () => React.createElement(
      withAlignment(({ alignBy, setAlignBy }) => (
        <div>
          <Step
            label="Align by event #"
            onChange={(val) => { console.log(val); setAlignBy(() => val); }}
          />
          <ResponsiveVis
            a={Math.random()}
            data={dataset.allEvents}
            alignBy={events => (alignBy >= 0 ? alignBy : events.length + alignBy)}
          />
          {Object.keys(dataset.userEvents).map(u => (
            <div key={dataset.userEvents[u][0][ENTITY_ID]} >
              {dataset.userEvents[u].map(d => d[EVENT_NAME])}
            </div>
          ))}
        </div>
      ))),
  };
});

export default examples;
