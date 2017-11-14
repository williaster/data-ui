import React from 'react';

import {
  XYChart,
  CrossHair,
  XAxis,
  CirclePackSeries,
  HorizontalReferenceLine,
  theme,
} from '@data-ui/xy-chart';

import ResponsiveXYChart from './ResponsiveXYChart';
import RectPointComponent from './RectPointComponent';
import { circlePackData } from './data';

const { colors } = theme;
const { margin } = XYChart.defaultProps;
const verticalMargin = margin.top + margin.bottom;

export default class CirclePackWithCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.resizeCallback = this.resizeCallback.bind(this);
  }

  resizeCallback({ domain }) {
    const height = Math.abs(domain[1] - domain[0]) + verticalMargin;

    // only update if we didn't already set this, or if height has changed significantly
    // e.g., due to window resize
    if (!this.state.height || Math.abs(height - this.state.height) > 10) {
      this.setState(() => ({ height }));
    }
  }

  render() {
    const heightOverride = {};
    if (this.state.height) heightOverride.height = this.state.height;

    return (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: 'time' }}
        yScale={{ type: 'linear' }}
        {...heightOverride}
      >

        <CirclePackSeries
          data={circlePackData.concat(circlePackData)}
          size={d => d.r}
          pointComponent={RectPointComponent}
          layoutCallback={this.resizeCallback}
        />

        <HorizontalReferenceLine reference={0} />

        <CrossHair
          showHorizontalLine={false}
          fullHeight
          stroke={colors.darkGray}
          circleFill="white"
          circleStroke={colors.darkGray}
        />
        <XAxis label="Time" numTicks={5} />
      </ResponsiveXYChart>
    );
  }
}
