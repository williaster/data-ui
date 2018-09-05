/* eslint react/prop-types: 0 */
import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';

import { CrossHair, XAxis, YAxis, BarSeries, PatternCircles } from '@data-ui/xy-chart';

import colors, { allColors } from '@data-ui/theme/lib/color';
import ResponsiveXYChart from './ResponsiveXYChart';

import { timeSeriesData } from './data';

export const parseDate = timeParse('%Y%m%d');
export const formatDate = timeFormat('%b %d');
export const formatYear = timeFormat('%Y');
export const dateFormatter = date => formatYear(parseDate(date));

const categoryHorizontalData = timeSeriesData.map((d, i) => ({
  x: d.y,
  y: i + 1,
}));

const categoryData = timeSeriesData.map((d, i) => ({
  x: i + 1,
  y: d.y,
}));

class HorizontalBarChartExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      direction: 'horizontal',
    };
  }

  renderControls() {
    return (
      <div className="bar-demo--form">
        <div>
          Bar direction:
          {'  '}
          <label>
            <input
              type="radio"
              value="horizontal"
              onChange={e => this.setState({ direction: e.target.value })}
              checked={this.state.direction === 'horizontal'}
            />{' '}
            horizonal
          </label>
          <label>
            <input
              type="radio"
              value="vertical"
              onChange={e => this.setState({ direction: e.target.value })}
              checked={this.state.direction !== 'horizontal'}
            />{' '}
            vertical
          </label>
        </div>
      </div>
    );
  }

  render() {
    const { direction } = this.state;
    const categoryScale = { type: 'band', paddingInner: 0.4 };
    const valueScale = { type: 'linear' };
    const horizontal = direction === 'horizontal';

    return (
      <div className="horizontal-bar-demo">
        {this.renderControls()}
        <ResponsiveXYChart
          ariaLabel="Required label"
          eventTrigger="series"
          xScale={horizontal ? valueScale : categoryScale}
          yScale={horizontal ? categoryScale : valueScale}
          margin={{ left: 100, top: 64, bottom: 64 }}
        >
          <PatternCircles
            id="horizontal_bar_circles"
            width={6}
            height={6}
            radius={2}
            fill={allColors.blue[horizontal ? 2 : 8]}
            strokeWidth={0}
          />
          <BarSeries
            fill={allColors.blue[horizontal ? 8 : 2]}
            horizontal={horizontal}
            data={horizontal ? categoryHorizontalData : categoryData}
          />
          <BarSeries
            fill="url(#horizontal_bar_circles)"
            horizontal={horizontal}
            data={horizontal ? categoryHorizontalData : categoryData}
            stroke={allColors.blue[8]}
            strokeWidth={1.5}
          />
          <CrossHair
            showHorizontalLine={!horizontal}
            showVerticalLine={horizontal}
            fullHeight
            fullWidth
            strokeDasharray=""
            stroke={allColors.blue[8]}
            circleFill={allColors.blue[7]}
            circleStroke="white"
          />
          <YAxis numTicks={5} orientation="left" />
          <XAxis numTicks={5} />
        </ResponsiveXYChart>

        <style type="text/css">
          {`
          .bar-demo--form > div {
            margin-bottom: 8px;
            margin-right: 12px;
          }
        `}
        </style>
      </div>
    );
  }
}

export default HorizontalBarChartExample;
