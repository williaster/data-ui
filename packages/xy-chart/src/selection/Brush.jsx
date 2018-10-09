import PropTypes from 'prop-types';
import React from 'react';
import { color } from '@data-ui/theme';

import BaseBrush from '../utils/brush/Brush';
import { generalStyleShape, marginShape } from '../utils/propShapes';
import { scaleInvert, getDomainFromExtent } from '../utils/chartUtils';

const SAFE_PIXEL = 2;

export const propTypes = {
  selectedBoxStyle: generalStyleShape,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  innerHeight: PropTypes.number,
  innerWidth: PropTypes.number,
  onChange: PropTypes.func,
  onBrushStart: PropTypes.func,
  onBrushEnd: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  margin: marginShape,
  brushDirection: PropTypes.oneOf(['vertical', 'horizontal', 'both']),
  resizeTriggerAreas: PropTypes.arrayOf(
    PropTypes.oneOf([
      'left',
      'right',
      'top',
      'bottom',
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
    ]),
  ),
  brushRegion: PropTypes.oneOf(['xAxis', 'yAxis', 'chart']),
  yAxisOrientation: PropTypes.oneOf(['left', 'right']),
  xAxisOrientation: PropTypes.oneOf(['top', 'bottom']),
  disableDraggingSelection: PropTypes.bool,
  handleSize: PropTypes.number,
};

const defaultProps = {
  xScale: null,
  yScale: null,
  onChange: null,
  innerHeight: 0,
  innerWidth: 0,
  selectedBoxStyle: {
    fill: color.default,
    fillOpacity: 0.2,
    stroke: color.default,
    strokeWidth: 1,
    strokeOpacity: 0.8,
  },
  margin: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  handleSize: 4,
  brushDirection: 'horizontal',
  resizeTriggerAreas: ['left', 'right'],
  brushRegion: 'chart',
  yAxisOrientation: 'right',
  xAxisOrientation: 'bottom',
  onBrushStart: null,
  onBrushEnd: null,
  disableDraggingSelection: false,
  onMouseMove: null,
  onMouseLeave: null,
  onClick: null,
};

class Brush extends React.Component {
  constructor(props) {
    super(props);

    this.BaseBrush = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleBrushStart = this.handleBrushStart.bind(this);
    this.handleBrushEnd = this.handleBrushEnd.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.BaseBrush.reset();
  }

  handleChange(brush) {
    const { onChange } = this.props;
    if (!onChange) return;
    const { x0 } = brush.extent;
    if (x0 < 0 || typeof x0 === 'undefined') {
      onChange(null);

      return;
    }
    const domain = this.convertRangeToDomain(brush);
    onChange(domain);
  }

  convertRangeToDomain(brush) {
    const { xScale, yScale } = this.props;
    const { x0, x1, y0, y1 } = brush.extent;

    const xDomain = getDomainFromExtent(xScale, x0, x1, SAFE_PIXEL);
    const yDomain = getDomainFromExtent(yScale, y0, y1, SAFE_PIXEL);

    const domain = {
      x0: xDomain.start,
      x1: xDomain.end,
      xValues: xDomain.values,
      y0: yDomain.start,
      y1: yDomain.end,
      yValues: yDomain.values,
    };

    return domain;
  }

  handleBrushStart(point) {
    const { x, y } = point;
    const { onBrushStart, xScale, yScale } = this.props;
    const invertedX = scaleInvert(xScale, x);
    const invertedY = scaleInvert(yScale, y);
    if (onBrushStart) {
      onBrushStart({
        x: xScale.invert ? invertedX : xScale.domain()[invertedX],
        y: yScale.invert ? invertedY : yScale.domain()[invertedY],
      });
    }
  }

  handleBrushEnd(brush) {
    const { onBrushEnd } = this.props;
    if (!onBrushEnd) return;
    const { x0 } = brush.extent;
    if (x0 < 0) {
      onBrushEnd(null);

      return;
    }
    const domain = this.convertRangeToDomain(brush);
    onBrushEnd(domain);
  }

  render() {
    const {
      xScale,
      yScale,
      innerHeight,
      innerWidth,
      margin,
      brushDirection,
      resizeTriggerAreas,
      brushRegion,
      yAxisOrientation,
      xAxisOrientation,
      selectedBoxStyle,
      disableDraggingSelection,
      onMouseLeave,
      onMouseMove,
      onClick,
      handleSize,
    } = this.props;
    if (!xScale || !yScale) return null;

    let brushRegionWidth;
    let brushRegionHeight;
    let left;
    let top;

    if (brushRegion === 'chart') {
      left = 0;
      top = 0;
      brushRegionWidth = innerWidth;
      brushRegionHeight = innerHeight;
    } else if (brushRegion === 'yAxis') {
      top = 0;
      brushRegionHeight = innerHeight;
      if (yAxisOrientation === 'right') {
        left = innerWidth;
        brushRegionWidth = margin.right;
      } else {
        left = -margin.left;
        brushRegionWidth = margin.left;
      }
    } else {
      left = 0;
      brushRegionWidth = innerWidth;
      if (xAxisOrientation === 'bottom') {
        top = innerHeight;
        brushRegionHeight = margin.bottom;
      } else {
        top = -margin.top;
        brushRegionHeight = margin.top;
      }
    }

    return (
      <BaseBrush
        width={brushRegionWidth}
        height={brushRegionHeight}
        left={left}
        top={top}
        inheritedMargin={margin}
        onChange={this.handleChange}
        onBrushEnd={this.handleBrushEnd}
        onBrushStart={this.handleBrushStart}
        handleSize={handleSize}
        resizeTriggerAreas={resizeTriggerAreas}
        brushDirection={brushDirection}
        selectedBoxStyle={selectedBoxStyle}
        disableDraggingSelection={disableDraggingSelection}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onClick={onClick}
        ref={el => {
          this.BaseBrush = el;
        }}
      />
    );
  }
}

Brush.propTypes = propTypes;
Brush.defaultProps = defaultProps;
Brush.displayName = 'Brush';

export default Brush;
