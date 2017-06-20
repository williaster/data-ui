import { css, StyleSheet } from 'aphrodite';
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Select, StepIncrementer } from '@data-ui/forms';

import { scaleShape, xScaleTypeShape, yScaleTypeShape } from '../propShapes';
import formatIncrementerValue from '../utils/formatIncrementerValue';
import { fontFamily } from '../theme';

import {
  ANY_EVENT_TYPE,
  ELAPSED_TIME_SCALE,
  EVENT_SEQUENCE_SCALE,
  EVENT_COUNT_SCALE,
  NODE_SEQUENCE_SCALE,
} from '../constants';

export const width = 300;

const unit = 8;
const padding = 2 * unit;
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    fontFamily,
    fontSize: 12,
    fontColor: '#767676',
    width: `calc(100% - ${EVENT_COUNT_SCALE}px)`,
    height: '100%',
    padding,
    background: '#fff',
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  alignBySelect: {
    paddingLeft: 1 * unit,
    fontWeight: 700,
    flexGrow: 1,
  },

  header: {
    position: 'absolute',
    top: 0,
    right: '100%',
    textAlign: 'right',
  },

  input: {
    paddingBottom: 3 * unit,
  },

  label: {
    fontWeight: 700,
    fontSize: 14,
  },
});

const propTypes = {
  alignByIndex: PropTypes.number.isRequired,
  alignByEventType: PropTypes.string.isRequired,
  showControls: PropTypes.bool.isRequired,
  colorScale: scaleShape.isRequired,
  xScaleType: xScaleTypeShape.isRequired,
  yScaleType: yScaleTypeShape.isRequired,
  onChangeXScale: PropTypes.func.isRequired,
  onChangeYScale: PropTypes.func.isRequired,
  onToggleShowControls: PropTypes.func.isRequired,
  onChangeAlignByIndex: PropTypes.func.isRequired,
  onChangeAlignByEventType: PropTypes.func.isRequired,
};

const defaultProps = {};

function ControlPanel({
  showControls,
  alignByIndex,
  alignByEventType,
  xScaleType,
  yScaleType,
  colorScale,
  onToggleShowControls,
  onChangeAlignByEventType,
  onChangeAlignByIndex,
  onChangeXScale,
  onChangeYScale,
}) {
  const eventTypeOptions = [
    { value: ANY_EVENT_TYPE, label: 'event' },
    ...colorScale.scale.domain().map(value => ({ value, label: value })),
  ];

  const valueRenderer = ({ value }) => (
    value === ANY_EVENT_TYPE ? 'event' :
    <span style={{ color: colorScale.scale(value) }}>
      {value}
    </span>
  );

  return (
    <div className={css(styles.container)}>

      <div className={css(styles.header)}>
        <Button onClick={onToggleShowControls}>
          {showControls ?
            <span>{'Hide >'}</span> : <span>{'< Controls'}</span>}
        </Button>
      </div>


      <div className={css(styles.input)}>
        <div className={css(styles.label)}>
          X-axis
        </div>
        <Select
          value={xScaleType}
          options={[
            { label: 'Elapsed time', value: ELAPSED_TIME_SCALE },
            { label: 'Event sequence', value: EVENT_SEQUENCE_SCALE },
          ]}
          onChange={({ value }) => onChangeXScale(value)}
        />
      </div>

      <div className={css(styles.input)}>
        <div className={css(styles.label)}>
          Y-axis
        </div>
        <Select
          value={yScaleType}
          options={[
            { label: 'Event count', value: EVENT_COUNT_SCALE },
            { label: 'Normalized size', value: NODE_SEQUENCE_SCALE },
          ]}
          onChange={({ value }) => onChangeYScale(value)}
        />
      </div>

      <div className={css(styles.input)}>
        <div className={css(styles.label)}>
          Align sequences by
        </div>
        <div className={css(styles.flexRow)}>
          <StepIncrementer
            min={-5}
            max={5}
            value={alignByIndex}
            onChange={onChangeAlignByIndex}
            formatValue={formatIncrementerValue}
            disableZero
          />
          <div className={css(styles.alignBySelect)}>
            <Select
              value={alignByEventType}
              options={eventTypeOptions}
              optionRenderer={valueRenderer}
              valueRenderer={valueRenderer}
              onChange={({ value }) => onChangeAlignByEventType(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ControlPanel.propTypes = propTypes;
ControlPanel.defaultProps = defaultProps;

export default ControlPanel;
