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
  ORDER_BY_EVENT_COUNT,
  ORDER_BY_ELAPSED_MS,
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
    width: `calc(100% - ${padding}px)`,
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

  option: {
    display: 'flex',
    alignItems: 'center',
  },

  optionLegend: {
    color: 'inherit',
    background: 'currentColor',
    width: 12,
    height: 12,
    borderRadius: '50%',
    marginRight: 8,
  },

  title: {
    fontWeight: 700,
    fontSize: 14,
  },
});

const propTypes = {
  alignByIndex: PropTypes.number.isRequired,
  alignByEventType: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  colorScale: scaleShape.isRequired,
  xScaleType: xScaleTypeShape.isRequired,
  yScaleType: yScaleTypeShape.isRequired,
  onChangeXScale: PropTypes.func.isRequired,
  onChangeYScale: PropTypes.func.isRequired,
  onToggleShowControls: PropTypes.func.isRequired,
  onChangeAlignByIndex: PropTypes.func.isRequired,
  onChangeAlignByEventType: PropTypes.func.isRequired,
  onChangeOrderBy: PropTypes.func.isRequired,
  showControls: PropTypes.bool.isRequired,
};

const defaultProps = {};

function ControlPanel({
  showControls,
  alignByIndex,
  alignByEventType,
  orderBy,
  xScaleType,
  yScaleType,
  colorScale,
  onToggleShowControls,
  onChangeAlignByEventType,
  onChangeAlignByIndex,
  onChangeXScale,
  onChangeYScale,
  onChangeOrderBy,
}) {
  const eventTypeOptions = [
    { value: ANY_EVENT_TYPE, label: 'event' },
    ...colorScale.scale.domain().map(value => ({ value, label: value })),
  ];

  const valueRenderer = (option) => {
    if (option.value === ANY_EVENT_TYPE) return option.label;
    const color = colorScale.scale(option.value);
    return (
      <div className={css(styles.option)} style={{ color }}>
        <div className={css(styles.optionLegend)} />
        {option.label}
      </div>
    );
  };

  return (
    <div className={css(styles.container)}>

      <div className={css(styles.header)}>
        <Button onClick={onToggleShowControls}>
          {showControls ?
            <span>{'Hide >'}</span> : <span>{'< Controls'}</span>}
        </Button>
      </div>

      {showControls &&
        <div>
          <div className={css(styles.input)}>
            <div className={css(styles.title)}>
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
            <div className={css(styles.title)}>
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
            <div className={css(styles.title)}>
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

          <div className={css(styles.input)}>
            <div className={css(styles.title)}>
              Sort nodes with the same parent by
            </div>
            <Select
              value={orderBy}
              options={[
                { label: 'Event count', value: ORDER_BY_EVENT_COUNT },
                { label: 'Time to next event', value: ORDER_BY_ELAPSED_MS },
              ]}
              onChange={({ value }) => onChangeOrderBy(value)}
            />
          </div>
        </div>}
    </div>
  );
}

ControlPanel.propTypes = propTypes;
ControlPanel.defaultProps = defaultProps;

export default ControlPanel;
