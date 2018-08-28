/* eslint react/prop-types: 0 */
import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';
import { median } from 'd3-array';
import {
  CrossHair,
  XAxis,
  YAxis,
  AreaSeries,
  PatternLines,
  HorizontalReferenceLine,
  Brush,
} from '@data-ui/xy-chart';

import colors, { allColors } from '@data-ui/theme/lib/color';

import { appleStockData as timeSeriesData } from './data';
import ResponsiveXYChart from './ResponsiveXYChart';

const avgPrice = median(timeSeriesData, d => d.y);
export const parseDate = timeParse('%Y%m%d');
export const formatDate = timeFormat('%b %d');
export const formatYear = timeFormat('%Y');
export const dateFormatter = date => formatDate(parseDate(date));

const COLOR = 'blue';
const BRIGHTNESS = 4;

class BrushableLinkedLineCharts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      brushedData: [...timeSeriesData],
    };
    this.handleBrushChange = this.handleBrushChange.bind(this);
  }

  handleBrushChange(domain) {
    const { brushDirection } = this.state;
    let brushedData = [...timeSeriesData];
    if (domain) {
      if (brushDirection === 'horizontal') {
        brushedData = brushedData.filter(point => point.x > domain.x0 && point.x < domain.x1);
      } else if (brushDirection === 'vertical') {
        brushedData = brushedData.filter(point => point.y > domain.y0 && point.y < domain.y1);
      } else {
        brushedData = brushedData.filter(
          point =>
            point.x > domain.x0 &&
            point.x < domain.x1 &&
            point.y > domain.y0 &&
            point.y < domain.y1,
        );
      }
    }
    this.setState(() => ({
      brushedData,
    }));
  }

  render() {
    const { brushedData } = this.state;

    return (
      <div className="brush-demo">
        <ResponsiveXYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
          margin={{ left: 5, top: 5, bottom: 5, right: 100 }}
          eventTrigger="series"
          height={300}
        >
          <PatternLines
            id="brush_pattern"
            height={8}
            width={8}
            stroke={allColors[COLOR][BRIGHTNESS]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <AreaSeries
            data={brushedData}
            strokeWidth={2}
            fill={allColors[COLOR][BRIGHTNESS]}
            stroke={allColors[COLOR][BRIGHTNESS]}
          />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleFill={allColors[COLOR][BRIGHTNESS]}
            circleStroke="white"
          />
          <HorizontalReferenceLine
            reference={avgPrice}
            stroke={allColors[COLOR][BRIGHTNESS]}
            strokeDasharray="7,3"
            strokeLinecap="butt"
            label="Avg"
            labelProps={{ dy: 0 }}
          />
          <YAxis
            label="Apple stock price"
            labelOffset={70}
            tickFormat={d => `$${d}`}
            numTicks={5}
          />
        </ResponsiveXYChart>

        <ResponsiveXYChart
          ariaLabel="Brushable chart"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
          margin={{ left: 5, top: 5, right: 100 }}
          height={150}
          renderTooltip={null}
        >
          <PatternLines
            id="brush_pattern"
            height={12}
            width={12}
            stroke={allColors[COLOR][BRIGHTNESS]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <AreaSeries
            data={timeSeriesData}
            strokeWidth={2}
            fill={allColors[COLOR][BRIGHTNESS]}
            stroke={allColors[COLOR][BRIGHTNESS]}
          />
          <XAxis label="Time" numTicks={5} />
          <HorizontalReferenceLine
            reference={avgPrice}
            stroke={allColors[COLOR][BRIGHTNESS]}
            strokeDasharray="7,3"
            strokeLinecap="butt"
            label="Avg"
            labelProps={{ dy: 0 }}
          />
          <Brush
            handleSize={4}
            resizeTriggerAreas={['left', 'right']}
            brushDirection="horizontal"
            onChange={this.handleBrushChange}
            selectedBoxStyle={{
              fill: 'url(#brush_pattern)',
              stroke: allColors[COLOR][BRIGHTNESS],
            }}
          />
        </ResponsiveXYChart>
      </div>
    );
  }
}

export default BrushableLinkedLineCharts;
