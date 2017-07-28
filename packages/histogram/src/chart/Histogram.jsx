/* eslint class-methods-use-this: 0, react/no-unused-prop-types: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { Group } from '@vx/group';
import { scaleBand, scaleLinear } from '@vx/scale';

import { isAxis, isSeries } from '../utils/componentIsX';
import collectBinnedDataFromChildSeries from '../utils/collectBinnedDataFromChildSeries';
import componentName from '../utils/componentName';
import computeDomainsFromBins from '../utils/computeDomainsFromBins';

const propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  binValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  binCount: PropTypes.number,
  binType: PropTypes.oneOf(['numeric', 'categorical']),
  children: PropTypes.node.isRequired,
  cumulative: PropTypes.bool,
  height: PropTypes.number.isRequired,
  limits: PropTypes.array, // values outside the limits are ignored
  margin: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  normalized: PropTypes.bool,
  // showMean: PropTypes.bool,
  // showMedian: PropTypes.bool,
  // showQuartiles: PropTypes.bool,
  width: PropTypes.number.isRequired,
  valueAccessor: PropTypes.func,
};

const defaultProps = {
  binCount: null,
  binType: 'numeric',
  binValues: null,
  cumulative: false,
  limits: null,
  margin: {
    top: 32,
    right: 32,
    bottom: 32,
    left: 32,
  },
  normalized: false,
  valueAccessor: d => d,
};

class Histogram extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    // @TODO be more intelligent about updates
    this.setState(this.getStateFromProps(nextProps));
  }

  getStateFromProps(props) {
    const dimensions = this.getDimmensions(props);
    const binsByIndex = this.getBinnedData(props);
    const scales = this.getScales(props, binsByIndex, dimensions);

    return {
      binsByIndex,
      ...dimensions,
      ...scales,
    };
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

  getBinnedData(props) {
    const { children, binCount, binType, binValues, limits, valueAccessor } = props || this.props;
    return collectBinnedDataFromChildSeries({
      children,
      binCount,
      binType,
      binValues,
      limits,
      valueAccessor,
    });
  }

  getScales(props, binsByIndex, { innerHeight, innerWidth }) {
    const { binType, binValues, cumulative, horizontal, normalized } = props || this.props;

    const binScaleFunc = binType === 'numeric' ? scaleLinear : scaleBand;
    const valueKey = (cumulative && 'cumulative') || (normalized && 'density') || 'count';
    const { binDomain, valueDomain } = computeDomainsFromBins({
      binsByIndex,
      binType,
      binValues,
      valueKey,
    });

    const binRange = horizontal ? [innerHeight, 0] : [0, innerWidth];
    const valueRange = horizontal ? [0, innerWidth] : [innerHeight, 0];

    return {
      binScale: binScaleFunc({ range: binRange, domain: binDomain }),
      valueScale: scaleLinear({ range: valueRange, domain: valueDomain }),
      valueKey,
    };
  }

  render() {
    const { ariaLabel, children, width, height } = this.props;
    const { margin, binsByIndex, binScale, valueScale, valueKey } = this.state;
    debugger;
    return (
      <svg
        aria-label={ariaLabel}
        role="img"
        width={width}
        height={height}
      >
        <Group left={margin.left} top={margin.top}>
          {React.Children.map(children, (Child, index) => {
            const name = componentName(Child);
            if (isSeries(name)) {
              const binnedData = binsByIndex[index];
              return React.cloneElement(Child, { binScale, valueScale, valueKey, binnedData });
            } else if (isAxis(name)) {
              return React.cloneElement(Child, { binScale, valueScale });
            }
            return Child;
          })}
        </Group>
      </svg>
    );
  }
}

Histogram.propTypes = propTypes;
Histogram.defaultProps = defaultProps;
Histogram.displayName = 'Histogram';

export default Histogram;
