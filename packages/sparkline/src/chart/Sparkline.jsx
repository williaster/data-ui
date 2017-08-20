/* eslint react/no-unused-prop-types: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { extent } from 'd3-array';
import Group from '@vx/group/build/Group';
import scaleLinear from '@vx/scale/build/scales/linear';

import { componentName, isBandLine, isReferenceLine, isSeries } from '../utils/componentIsX';
import isDefined from '../utils/defined';

const propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
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
  preserveAspectRatio: PropTypes.string,
  styles: PropTypes.object,
  width: PropTypes.number.isRequired,
  valueAccessor: PropTypes.func,
  viewBox: PropTypes.string,
};

const defaultProps = {
  className: null,
  data: [],
  margin: {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16,
  },
  max: null,
  min: null,
  preserveAspectRatio: null,
  styles: null,
  valueAccessor: d => d,
  viewBox: null,
};

const getX = d => d.x;
const getY = d => d.y;

const parsedDatumThunk = valueAccessor => (d, i) => {
  const y = valueAccessor(d);
  return { x: i, y, id: y, ...d };
};

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
    const data = rawData.map(parsedDatumThunk(valueAccessor));
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
    const {
      ariaLabel,
      children,
      className,
      height,
      preserveAspectRatio,
      styles,
      width,
      viewBox,
    } = this.props;
    const { data, margin, xScale, yScale } = this.state;
    return (
      <svg
        aria-label={ariaLabel}
        className={className}
        height={height}
        role="img"
        preserveAspectRatio={preserveAspectRatio}
        style={styles}
        width={width}
        viewBox={viewBox}
      >
        <Group left={margin.left} top={margin.top}>
          {React.Children.map(children, (Child) => {
            const name = componentName(Child);
            if (isSeries(name) || isReferenceLine(name) || isBandLine(name)) {
              return (
                React.cloneElement(Child, {
                  xScale,
                  yScale,
                  data,
                  getX,
                  getY,
                })
              );
            }
            return Child;
          })}
        </Group>
      </svg>
    );
  }
}

Sparkline.propTypes = propTypes;
Sparkline.defaultProps = defaultProps;
Sparkline.displayName = 'Sparkline';

export default Sparkline;
