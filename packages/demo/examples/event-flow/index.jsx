import React from 'react';
import { withScreenSize } from '@vx/responsive';

import {
  App,
  sampleEvents,
} from '@data-ui/event-flow';

const ResponsiveVis = withScreenSize(({ screenWidth, screenHeight, ...rest }) => (
  <App
    width={screenWidth * 0.8}
    height={screenHeight * 0.8}
    {...rest}
  />
));

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
