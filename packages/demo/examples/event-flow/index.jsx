import React from 'react';
import PropTypes from 'prop-types';
import { withScreenSize } from '@vx/responsive';
// import data from './omg_20170605T183803.json';

import {
  TS,
  EVENT_NAME,
  ENTITY_ID,

  // cleanEvents,
  // binEventsByEntityId,
  // buildNodesFromEntityEvents,
  buildGraph,
  // getNodeFromEvent,

  // buildHierarchy,

  // addMetaDataToNodes,
  // createRoot,
  VisApp,
} from '@data-ui/event-flow';

const user1 = [
  { [TS]: new Date('2017-03-22 18:33:10'), [EVENT_NAME]: 'a', [ENTITY_ID]: 'u1' },
  { [TS]: new Date('2017-03-22 19:34:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u1' },
  { [TS]: new Date('2017-03-22 20:35:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u1' },
  { [TS]: new Date('2017-03-22 22:36:10'), [EVENT_NAME]: 'd', [ENTITY_ID]: 'u1' },
];

const user2 = [
  { [TS]: new Date('2017-03-22 18:33:10'), [EVENT_NAME]: 'a', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 19:34:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 20:35:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 21:36:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u2' },
  { [TS]: new Date('2017-03-22 22:37:10'), [EVENT_NAME]: 'd', [ENTITY_ID]: 'u2' },
];

const user3 = [
  { [TS]: new Date('2017-03-22 18:34:10'), [EVENT_NAME]: 'b', [ENTITY_ID]: 'u3' },
  { [TS]: new Date('2017-03-22 20:36:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u3' },
  { [TS]: new Date('2017-03-22 21:37:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u3' },
  { [TS]: new Date('2017-03-22 23:38:10'), [EVENT_NAME]: 'c', [ENTITY_ID]: 'u3' },
  { [TS]: new Date('2017-03-23 18:39:10'), [EVENT_NAME]: 'd', [ENTITY_ID]: 'u3' },
];

const data = user1; //[...user1, ...user2, ...user3];
const ResponsiveVis = withScreenSize(({ screenWidth, ...rest }) => (
  <VisApp
    width={screenWidth * 0.8}
    height={screenWidth * 0.8 * 0.6}
    {...rest}
  />
));

export default [
  {
    description: 'Vis',
    example: () => (
      <div>
        <ResponsiveVis
          data={data}
        />
      </div>
    ),
  },
  {
    description: 'Graph',
    example: () => (
      <div>
        <pre>{JSON.stringify(buildGraph(data), null, 2)}</pre>
      </div>
    ),
  },
];
