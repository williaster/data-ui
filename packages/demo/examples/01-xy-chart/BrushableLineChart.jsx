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
  LineSeries,
  PatternLines,
  LinearGradient,
  Brush,
} from '@data-ui/xy-chart';

import colors, { allColors } from '@data-ui/theme/lib/color';

import { timeSeriesData } from './data';
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
      brushRegion: 'chart',
      xAxisOrientation: 'bottom',
      yAxisOrientation: 'left',
      disableDraggingSelection: false,
    };
    this.handleBrushChange = this.handleBrushChange.bind(this);
  }

  handleBrushChange(domain) {
    const { brushDirection } = this.state;
    let pointData;
    if (domain) {
      if (brushDirection === 'horizontal') {
        pointData = timeSeriesData.filter(point => point.x > domain.x0 && point.x < domain.x1);
      } else if (brushDirection === 'vertical') {
        pointData = timeSeriesData.filter(point => point.y > domain.y0 && point.y < domain.y1);
      } else {
        pointData = timeSeriesData.filter(
          point =>
            point.x > domain.x0 &&
            point.x < domain.x1 &&
            point.y > domain.y0 &&
            point.y < domain.y1,
        );
      }
    } else {
      pointData = [...timeSeriesData];
    }
    this.setState(() => ({
      pointData,
    }));
  }

  renderControls() {
    const { disableDraggingSelection, resizeTriggerAreas } = this.state;
    const resizeTriggerAreaset = new Set(resizeTriggerAreas);

    return (
      <div className="brush-demo--form">
        <h4>Brush Props</h4>
        <div>
          Disable Dragging the Selection
          <label>
            <input
              type="checkbox"
              onChange={() => {
                this.setState(() => ({
                  disableDraggingSelection: !disableDraggingSelection,
                }));
              }}
              checked={disableDraggingSelection}
            />
          </label>
        </div>
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
          Brush brushRegion:
          <label>
            <input
              type="radio"
              value="xAxis"
              onChange={e =>
                this.setState({
                  brushRegion: e.target.value,
                  brushDirection: 'horizontal',
                })
              }
              checked={this.state.brushRegion === 'xAxis'}
            />{' '}
            xAxis
          </label>
          <label>
            <input
              type="radio"
              value="yAxis"
              onChange={e =>
                this.setState({
                  brushRegion: e.target.value,
                  brushDirection: 'vertical',
                })
              }
              checked={this.state.brushRegion === 'yAxis'}
            />{' '}
            yAxis
          </label>
          <label>
            <input
              type="radio"
              value="chart"
              onChange={e => this.setState({ brushRegion: e.target.value })}
              checked={this.state.brushRegion === 'chart'}
            />{' '}
            chart
          </label>
        </div>

        <div>
          X Axis Orientation:
          <label>
            <input
              type="radio"
              value="top"
              onChange={e => this.setState({ xAxisOrientation: e.target.value })}
              checked={this.state.xAxisOrientation === 'top'}
            />{' '}
            top
          </label>
          <label>
            <input
              type="radio"
              value="bottom"
              onChange={e => this.setState({ xAxisOrientation: e.target.value })}
              checked={this.state.xAxisOrientation === 'bottom'}
            />{' '}
            bottom
          </label>
        </div>

        <div>
          Y Axis Orientation:
          <label>
            <input
              type="radio"
              value="left"
              onChange={e => this.setState({ yAxisOrientation: e.target.value })}
              checked={this.state.yAxisOrientation === 'left'}
            />{' '}
            left
          </label>
          <label>
            <input
              type="radio"
              value="right"
              onChange={e => this.setState({ yAxisOrientation: 'right' })}
              checked={this.state.yAxisOrientation === 'right'}
            />{' '}
            right
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
    const { screenWidth } = this.props;
    const {
      pointData,
      brushDirection,
      resizeTriggerAreas,
      brushRegion,
      xAxisOrientation,
      yAxisOrientation,
      disableDraggingSelection,
    } = this.state;

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
          margin={{ left: 100, top: 64, bottom: 64 }}
        >
          <PatternLines
            id="brush_pattern"
            height={8}
            width={8}
            stroke={allColors.blue[1]}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          <LineSeries data={timeSeriesData} strokeWidth={2} stroke={allColors.blue[3]} />
          <PointSeries data={pointData} fillOpacity={1} fill={allColors.blue[7]} strokeWidth={1} />
          <CrossHair
            showHorizontalLine={false}
            fullHeight
            stroke={colors.darkGray}
            circleFill={colors.categories[2]}
            circleStroke="white"
          />
          <YAxis label="Value" numTicks={5} orientation={yAxisOrientation} />
          <XAxis label="Time" numTicks={5} orientation={xAxisOrientation} />
          <Brush
            handleSize={4}
            resizeTriggerAreas={resizeTriggerAreas}
            brushDirection={brushDirection}
            onChange={this.handleBrushChange}
            brushRegion={brushRegion}
            disableDraggingSelection={disableDraggingSelection}
            selectedBoxStyle={{
              fill: 'url(#brush_pattern)',
              stroke: allColors.blue[5],
            }}
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
