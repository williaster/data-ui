/* eslint react/prop-types: 0 */
import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';
import {
  CrossHair,
  XAxis,
  YAxis,
  BarSeries,
  PatternLines,
  Brush,
  Text,
  HorizontalReferenceLine,
  VerticalReferenceLine,
} from '@data-ui/xy-chart';
import { allColors } from '@data-ui/theme/lib/color';
import { xTickStyles, yTickStyles } from '@data-ui/theme/lib/chartTheme';
import ResponsiveXYChart from './ResponsiveXYChart';

import { timeSeriesData } from './data';

export const parseDate = timeParse('%Y%m%d');
export const formatDate = timeFormat('%b %d');
export const formatYear = timeFormat('%Y');
export const dateFormatter = date => formatYear(parseDate(date));
const COLOR_1 = 'grape';
const COLOR_2 = 'gray';
const BRIGHTNESS = 5;
const BRIGHTNESS_DARK = 7;
const xTickLabelProps = {
  ...xTickStyles.label.bottom,
  stroke: allColors[COLOR_1][BRIGHTNESS_DARK],
};

const yTickLabelProps = {
  ...yTickStyles.label.left,
  stroke: allColors[COLOR_1][BRIGHTNESS_DARK],
};

const categoryHorizontalData = timeSeriesData.map((d, i) => ({
  x: d.y,
  y: i + 1,
  selected: false,
  label: i === 3 ? 'Long long label' : (i === 5 && 'Label') || '',
}));

const categoryData = timeSeriesData.map((d, i) => ({
  x: i + 1,
  y: d.y,
  selected: false,
  label: i === 3 ? 'Long long label' : (i === 5 && 'Label') || '',
}));

class HorizontalBarChartExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      direction: 'horizontal',
      data: categoryHorizontalData,
    };
    this.Brush = React.createRef();
    this.handleBrushChange = this.handleBrushChange.bind(this);
  }

  handleBrushChange(domain) {
    let valueSet = new Set();
    const { direction } = this.state;
    const horizontal = direction === 'horizontal';
    if (domain) {
      const values = horizontal ? domain.yValues : domain.xValues;
      valueSet = new Set(values);
    }
    let data;
    if (horizontal) {
      data = categoryHorizontalData.map(bar => ({
        ...bar,
        selected: valueSet.has(bar.y),
      }));
    } else {
      data = categoryData.map(bar => ({
        ...bar,
        selected: valueSet.has(bar.x),
      }));
    }
    this.setState(() => ({
      data,
    }));
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
              onChange={e => {
                this.Brush.current.reset();
                this.setState({
                  direction: e.target.value,
                  data: [...categoryHorizontalData],
                });
              }}
              checked={this.state.direction === 'horizontal'}
            />{' '}
            horizonal
          </label>
          <label>
            <input
              type="radio"
              value="vertical"
              onChange={e => {
                this.Brush.current.reset();
                this.setState({
                  direction: e.target.value,
                  data: [...categoryData],
                });
              }}
              checked={this.state.direction !== 'horizontal'}
            />{' '}
            vertical
          </label>
        </div>
      </div>
    );
  }

  render() {
    const { direction, data } = this.state;
    const categoryScale = { type: 'band', paddingInner: 0.1 };
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
          <PatternLines
            id="brush_pattern"
            height={6}
            width={6}
            stroke={allColors[COLOR_1][BRIGHTNESS]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <PatternLines
            id="bar_pattern_1"
            height={6}
            width={6}
            stroke={allColors[COLOR_1][BRIGHTNESS]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <PatternLines
            id="bar_pattern_2"
            height={6}
            width={6}
            stroke={allColors[COLOR_2][BRIGHTNESS]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <BarSeries
            fill={bar => `url(#${bar.selected ? 'bar_pattern_1' : 'bar_pattern_2'})`}
            horizontal={horizontal}
            data={data.map((d, i) =>
              i % 4 === 0 ? { ...d, [horizontal ? 'x' : 'y']: -d[horizontal ? 'x' : 'y'] } : d,
            )}
            disableMouseEvents={horizontal} // bug with these tooltips
            renderLabel={({ datum, labelProps, index: i }) =>
              datum.label ? (
                <Text
                  {...labelProps}
                  fill={allColors[datum.selected ? COLOR_2 : COLOR_1][BRIGHTNESS_DARK]}
                  angle={datum.selected ? 20 * (i >= 5 ? -1 : 1) : 0}
                >
                  {datum.label}
                </Text>
              ) : null
            }
          />
          {horizontal ? (
            <VerticalReferenceLine reference={0} />
          ) : (
            <HorizontalReferenceLine reference={0} />
          )}
          <CrossHair
            showVerticalLine
            showHorizontalLine={false}
            fullHeight
            stroke={allColors[COLOR_1][BRIGHTNESS_DARK]}
            circleFill={allColors[COLOR_1][BRIGHTNESS_DARK]}
            circleStroke="white"
          />

          <Brush
            brushDirection={horizontal ? 'vertical' : 'horizontal'}
            ref={this.Brush}
            onChange={this.handleBrushChange}
            selectedBoxStyle={{
              fill: 'url(#brush_pattern)',
              fillOpacity: 0.2,
              stroke: allColors[COLOR_1][BRIGHTNESS_DARK],
            }}
          />
          <YAxis numTicks={5} orientation="left" tickLabelProps={() => yTickLabelProps} />
          <XAxis numTicks={5} tickLabelProps={() => xTickLabelProps} />
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
