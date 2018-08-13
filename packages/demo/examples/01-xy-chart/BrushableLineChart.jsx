/* eslint react/prop-types: 0 */
import React from 'react';
import { timeParse, timeFormat } from 'd3-time-format';

import {
  XYChart,
  CrossHair,
  XAxis,
  theme,
  withScreenSize,
  LineSeries,
  PatternLines,
  LinearGradient,
  Brush,
} from '@data-ui/xy-chart';

import colors from '@data-ui/theme/lib/color';

import {
  timeSeriesData,
} from './data';
import PointSeries from '../../node_modules/@data-ui/xy-chart/lib/series/PointSeries';

export const parseDate = timeParse('%Y%m%d');
export const formatDate = timeFormat('%b %d');
export const formatYear = timeFormat('%Y');
export const dateFormatter = date => formatDate(parseDate(date));


class BrushableLineChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pointData: [...timeSeriesData],
      brushDirection: 'horizontal',
      resizeTriggerAreas: ['left', 'right'],
    };
    this.handleBrushChange = this.handleBrushChange.bind(this);
  }

  handleBrushChange(domain) {
    let pointData;
    if (domain) {
      pointData = timeSeriesData.filter(point => point.x > domain.x0 && point.x < domain.x1 && point.y > domain.y0 && point.y < domain.y1);
    } else {
      pointData = [...timeSeriesData];
    }
    this.setState(() => ({
      pointData,
    }));
  }

  renderControls() {
    const { resizeTriggerAreas } = this.state;
    const resizeTriggerAreaset = new Set(resizeTriggerAreas);
    return (
      <div className="brush-demo--form">
        <h4>Brush Props</h4>
        <div>
          Brush Direction:
          <label>
            <input
              type="radio"
              value="horizontal"
              onChange={e => this.setState({ brushDirection: e.target.value })}
              checked={this.state.brushDirection === 'horizontal'}
            />{' '}
            horizonal
          </label>
          <label>
            <input
              type="radio"
              value="vertical"
              onChange={e => this.setState({ brushDirection: e.target.value })}
              checked={this.state.brushDirection === 'vertical'}
            />{' '}
            vertical
          </label>
          <label>
            <input
              type="radio"
              value="both"
              onChange={e => this.setState({ brushDirection: e.target.value })}
              checked={this.state.brushDirection === 'both'}
            />{' '}
            both
          </label>
        </div>

        <div>
          Resize Trigger Border:
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'left';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('left')}
            />
            left
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'right';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('right')}
            />
            right
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'top';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('top')}
            />
            top
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'bottom';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('bottom')}
            />
            bottom
          </label>
        </div>
        <div>
          Resize Trigger Corner:
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'topLeft';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('topLeft')}
            />
            topLeft
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'topRight';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('topRight')}
            />
            topRight
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'bottomLeft';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('bottomLeft')}
            />
            bottomLeft
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => {
                const value = 'bottomRight';
                if (resizeTriggerAreaset.has(value)) {
                  resizeTriggerAreaset.delete(value);
                } else {
                  resizeTriggerAreaset.add(value);
                }
                this.setState(() => ({
                  resizeTriggerAreas: [...resizeTriggerAreaset],
                }));
              }}
              checked={resizeTriggerAreaset.has('bottomRight')}
            />
            bottomRight
          </label>
        </div>
      </div>
    );
  }

  render() {
    const { screenWidth, ...rest } = this.props;
    const { pointData, brushDirection, resizeTriggerAreas } = this.state;
    return (
      <div className="brush-demo">
        {this.renderControls()}
        <XYChart
          theme={theme}
          width={Math.min(700, screenWidth / 1.5)}
          height={Math.min(700 / 2, screenWidth / 1.5 / 2)}
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
          margin={{ left: 0, top: 0, bottom: 64 }}
          {...rest}
        >
          <LinearGradient id="area_gradient" from={colors.categories[2]} to="#fff" />
          <PatternLines
            id="area_pattern"
            height={12}
            width={12}
            stroke={colors.categories[2]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <LineSeries
            seriesKey="one"
            data={timeSeriesData}
            strokeWidth={1}
          />
          <PointSeries
            seriesKey="one"
            data={pointData}
            strokeWidth={1}
          />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleFill={colors.categories[2]}
            circleStroke="white"
          />
          <XAxis label="Time" numTicks={5} />
          <Brush
            handleSize={4}
            resizeTriggerAreas={resizeTriggerAreas}
            brushDirection={brushDirection}
            onChange={this.handleBrushChange}
          />
        </XYChart>

        <style type="text/css">
          {`
          .brush-demo {
             display: flex;
             flex-direction: row;
             flex-wrap: wrap;
             align-items: center;
          }

          .brush-demo--form > div {
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

export default withScreenSize(BrushableLineChart);