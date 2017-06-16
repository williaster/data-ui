import React from 'react';
import { withScreenSize } from '@vx/responsive';
import { withState, compose } from 'recompose';
import { withStyles, css } from '../../themes/withStyles';

import data from './omg_20170605T183803.json';

import {
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,

  TS,
  EVENT_NAME,
  ENTITY_ID,

  cleanEvents,
  findNthIndexOfX,
  sampleEvents,
  Visualization,
} from '@data-ui/event-flow';

import { Select } from '@data-ui/forms';
import Step from './Step';


const ResponsiveVis = withScreenSize(({ screenWidth, screenHeight, ...rest }) => (
  <Visualization
    width={screenWidth * 0.8}
    height={screenHeight * 0.8}
    {...rest}
  />
));

const withAlignment = withState('alignBy', 'setAlignBy', 0);
const withXScaleSelect = withState('xScaleType', 'setXScale', ELAPSED_TIME_SCALE);
const withStylesHOC = withStyles(({ font }) => ({
  container: {
    ...font.small,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 250,
    paddingLeft: 8,
    ...font.small,
  },
}));

const enhancer = compose(withAlignment, withXScaleSelect, withStylesHOC);

// sampleEvents.realData = {
//   allEvents: cleanEvents(data, {
//     [TS]: d => new Date(d.ts_touch_point),
//     [EVENT_NAME]: d => d.dim_action_type,
//     [ENTITY_ID]: d => String(d.id_user),
//   }),
// };

// const alignByLastAffiliateClick = (events) => (
//   findNthIndexOfX(events, -1, d => (d[EVENT_NAME] === 'affiliate_impression'))
// );

// one example per dataset
const examples = Object.keys(sampleEvents).map((name) => {
  const dataset = sampleEvents[name];
  console.log(dataset);
  return {
    description: name,
    example: () => React.createElement(
      enhancer(({
        alignBy,
        setAlignBy,

        xScaleType,
        setXScale,

        styles,
      }) => (
        <div>
          <div {...css(styles.container)}>
            <Step
              label="Align by event #"
              onChange={setAlignBy}
              inline
            />
            <div {...css(styles.form)}>
              <strong>X-scale</strong>
              <Select
                initialValue={xScaleType}
                options={[
                  { label: 'Elapsed time', value: ELAPSED_TIME_SCALE },
                  { label: 'Event sequence', value: EVENT_SEQUENCE_SCALE },
                ]}
                onChange={setXScale}
              />
            </div>
          </div>
          <ResponsiveVis
            data={dataset.allEvents}
            alignBy={
              // name === 'realData' ? alignByLastAffiliateClick :
              events => (alignBy >= 0 ? alignBy : events.length + alignBy)}
            xScaleType={xScaleType}
          />
        </div>
      ))),
  };
});

export default examples;
