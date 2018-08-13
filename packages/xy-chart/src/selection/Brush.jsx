import PropTypes from 'prop-types';
import React from 'react';
import { color } from '@data-ui/theme';

import BaseBrush from '../utils/brush/Brush';

export const propTypes = {
  label: PropTypes.node,
  stroke: PropTypes.string,
  strokeDasharray: PropTypes.string,
  strokeWidth: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  innerHeight: PropTypes.number.isRequired,
  innerWidth: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

const defaultProps = {
  label: null,
  stroke: color.darkGray,
  strokeDasharray: null,
  strokeWidth: 1,
  xScale: null,
  yScale: null,
  onChange: () => {},
};

class Brush extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(brush) {
    const { xScale, yScale, margin, onChange } = this.props;
    const { x0, x1, y0, y1 } = brush.extent;
    if (x0 < 0) {
      onChange(null);
      return;
    }
    const invertedX0 = xScale.invert(x0 - margin.left);
    const invertedX1 = xScale.invert(x1 - margin.left);
    const invertedY0 = yScale.invert(y0 - margin.top);
    const invertedY1 = yScale.invert(y1 - margin.top);

    const domainRange = {
      x0: Math.min(invertedX0, invertedX1),
      x1: Math.max(invertedX0, invertedX1),
      y0: Math.min(invertedY0, invertedY1),
      y1: Math.max(invertedY0, invertedY1),
    };
    onChange(domainRange);
  }

  render() {
    const {
      label,
      stroke,
      strokeDasharray,
      strokeWidth,
      xScale,
      yScale,
      innerHeight,
      innerWidth,
      margin,
      onChange,
      brushDirection,
      resizeTriggerAreas,
    } = this.props;
    if (!xScale || !yScale) return null;
    return (
      <BaseBrush
        data={[]}
        width={innerWidth + margin.left}
        height={innerHeight + margin.top}
        left={0}
        top={0}
        onChange={this.handleChange}
        handleSize={4}
        resizeTriggerAreas={resizeTriggerAreas}
        brushDirection={brushDirection}
      />);
  }
}

Brush.propTypes = propTypes;
Brush.defaultProps = defaultProps;
Brush.displayName = 'Brush';

export default Brush;
