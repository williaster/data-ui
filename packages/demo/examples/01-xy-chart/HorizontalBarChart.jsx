/* eslint react/prop-types: 0 */
import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';

import {
  XYChart,
  CrossHair,
  XAxis,
  YAxis,
  theme,
  withScreenSize,
  BarSeries,
  PatternLines,
} from '@data-ui/xy-chart';

import colors, { allColors } from '@data-ui/theme/lib/color';

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
          Direction:
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
    const { screenWidth } = this.props;
    const { direction } = this.state;
    const categoryScale = { type: 'band', paddingInner: 0.15 };
    const valueScale = { type: 'linear' };
    const horizontal = direction === 'horizontal';

    return (
      <div className="horizontal-bar-demo">
        {this.renderControls()}
        <XYChart
          theme={theme}
          width={Math.min(700, screenWidth / 1.5)}
          height={Math.min(700 / 2, screenWidth / 1.5 / 2)}
          ariaLabel="Required label"
          xScale={horizontal ? valueScale : categoryScale}
          yScale={horizontal ? categoryScale : valueScale}
          margin={{ left: 100, top: 64, bottom: 64 }}
        >
          <PatternLines
            id="brush_pattern"
            height={12}
            width={12}
            stroke={allColors.blue[2]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <BarSeries
            horizontal={horizontal}
            data={horizontal ? categoryHorizontalData : categoryData}
          />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleFill={allColors.blue[7]}
            circleStroke="white"
          />
          <YAxis numTicks={5} orientation="left" />
          <XAxis numTicks={5} />
        </XYChart>

        <style type="text/css">
          {`
          .horizontal-bar-demo {
             display: flex;
             flex-direction: row;
             flex-wrap: wrap;
             align-items: center;
          }

          .bar-demo--form > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            margin-right: 12px;
          }
        `}
        </style>
      </div>
    );
  }
}

export default withScreenSize(HorizontalBarChartExample);
