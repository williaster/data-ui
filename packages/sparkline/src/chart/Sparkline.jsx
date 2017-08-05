/* eslint react/no-unused-prop-types: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { extent } from 'd3-array';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';

import isDefined from '../utils/defined';

const propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  data: PropTypes.array,
  height: PropTypes.number.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  max: PropTypes.number,
  min: PropTypes.number,
  width: PropTypes.number.isRequired,
  valueAccessor: PropTypes.func,
};

const defaultProps = {
  data: [],
  margin: {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16,
  },
  max: null,
  min: null,
  valueAccessor: d => d,
};

const getX = d => d.x;
const getY = d => d.y;

class Sparkline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getStateFromProps(props) {
    const dimensions = this.getDimmensions(props);
    const scales = this.getScales(props, dimensions);

    return {
      ...dimensions,
      ...scales,
    };
  }

  getScales(props, { innerHeight, innerWidth }) {
    const { data: rawData, min, max, valueAccessor } = props || this.props;
    const data = rawData.map((d, i) => ({ x: i, y: valueAccessor(d) }));
    const yExtent = extent(data, getY);
    const xScale = scaleLinear({
      domain: [0, data.length - 1],
      range: [0, innerWidth],
    });
    const yScale = scaleLinear({ // @TODO introduce props for centering data, etc.
      domain: [
        isDefined(min) ? min : yExtent[0],
        isDefined(max) ? max : yExtent[1],
      ],
      range: [innerHeight, 0],
    });
    return { xScale, yScale, data };
  }

  getDimmensions(props) {
    const { margin, width, height } = props || this.props;
    const completeMargin = { ...defaultProps.margin, ...margin };
    return {
      margin: completeMargin,
      innerHeight: height - completeMargin.top - completeMargin.bottom,
      innerWidth: width - completeMargin.left - completeMargin.right,
    };
  }

  render() {
    const { ariaLabel, children, height, width } = this.props;
    const { data, margin, xScale, yScale } = this.state;
    const childProps = {
      xScale,
      yScale,
      data,
      getX,
      getY,
    };

    return (
      <svg
        aria-label={ariaLabel}
        role="img"
        width={width}
        height={height}
      >
        <Group left={margin.left} top={margin.top}>
          {React.Children.map(children, Child => (
            // @TODO check for series or band type before cloning
            React.cloneElement(Child, childProps)
          ))}
        </Group>
      </svg>
    );
  }
}

Sparkline.propTypes = propTypes;
Sparkline.defaultProps = defaultProps;
Sparkline.displayName = 'Sparkline';

export default Sparkline;
