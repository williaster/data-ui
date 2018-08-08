/* eslint jsx-a11y/label-has-for: 0, no-mixed-operators: 0 */
import React from 'react';
import { allColors, chartTheme as theme } from '@data-ui/theme';
import { AreaSeries, CrossHair, PatternLines, YAxis } from '@data-ui/xy-chart';

import ResponsiveXYChart from './ResponsiveXYChart';
import { temperatureBands } from './data';

const color = 'blue';
const bandColor = 'blue';

const chartTheme = {
  ...theme,
  gridStyles: {
    ...theme.gridStyles,
    stroke: allColors[color][1],
    strokeWidth: 1,
  },
  yAxisStyles: {
    ...theme.yAxisStyles,
    stroke: allColors[color][7],
    strokeWidth: 2,
    strokeLineCap: 'round',
  },
  yTickStyles: {
    ...theme.yTickStyles,
    stroke: allColors[color][7],
  },
};

const tickValues = [20, 40, 60, 80];

class TickLabelPlayground extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tickSuffix: 'suffix for wrap',
      dx: -4,
      dy: 0,
      width: 100,
      angle: 0,
      scaleToFit: false,
      textAnchor: 'end',
      verticalAnchor: 'middle',
      fontSize: '0.9em',
      fontWeight: 200,
      lineHeight: '1em',
      axisOrientation: 'left',
    };

    this.animateAngle = this.animateAngle.bind(this);
  }

  componentDidMount() {
    this.animateAngle({ currAngle: this.state.angle });
  }

  componentWillUnmount() {
    clearTimeout(this.angleTimeout);
  }

  animateAngle({ currAngle }) {
    const nextAngle = currAngle >= 360 ? 0 : currAngle + 20;
    this.setState({ angle: nextAngle }, () => {
      if (nextAngle) {
        this.angleTimeout = setTimeout(() => this.animateAngle({ currAngle }), 40);
      }
    });
  }

  renderControls() {
    return (
      <div className="tick-demo--form">
        <h4>Tick Label Props</h4>
        <div>
          tick suffix:
          <input
            type="text"
            value={this.state.tickSuffix}
            onChange={e => this.setState({ tickSuffix: e.target.value })}
          />
        </div>

        <div>
          dx:
          <input
            type="range"
            min="-50"
            max="50"
            value={this.state.dx}
            onChange={e => this.setState({ dx: Number(e.target.value) })}
          />{' '}
          {this.state.dx}
        </div>

        <div>
          dy:
          <input
            type="range"
            min="-50"
            max="50"
            value={this.state.dy}
            onChange={e => this.setState({ dy: Number(e.target.value) })}
          />{' '}
          {this.state.dy}
        </div>

        <div>
          width:
          <input
            type="range"
            min="25"
            max="225"
            value={this.state.width}
            onChange={e => this.setState({ width: Number(e.target.value) })}
          />{' '}
          {this.state.width}
        </div>

        <div>
          angle:
          <input
            type="range"
            min="0"
            max="360"
            value={this.state.angle}
            onChange={e => this.setState({ angle: Number(e.target.value) })}
          />
        </div>

        <div>
          textAnchor:
          <label>
            <input
              type="radio"
              value="start"
              onChange={e => this.setState({ textAnchor: e.target.value })}
              checked={this.state.textAnchor === 'start'}
            />{' '}
            start
          </label>
          <label>
            <input
              type="radio"
              value="middle"
              onChange={e => this.setState({ textAnchor: e.target.value })}
              checked={this.state.textAnchor === 'middle'}
            />{' '}
            middle
          </label>
          <label>
            <input
              type="radio"
              value="end"
              onChange={e => this.setState({ textAnchor: e.target.value })}
              checked={this.state.textAnchor === 'end'}
            />{' '}
            end
          </label>
        </div>

        <div>
          verticalAnchor:
          <label>
            <input
              type="radio"
              value="start"
              onChange={e => this.setState({ verticalAnchor: e.target.value })}
              checked={this.state.verticalAnchor === 'start'}
            />{' '}
            start
          </label>
          <label>
            <input
              type="radio"
              value="middle"
              onChange={e => this.setState({ verticalAnchor: e.target.value })}
              checked={this.state.verticalAnchor === 'middle'}
            />{' '}
            middle
          </label>
          <label>
            <input
              type="radio"
              value="end"
              onChange={e => this.setState({ verticalAnchor: e.target.value })}
              checked={this.state.verticalAnchor === 'end'}
            />{' '}
            end
          </label>
        </div>

        <div>
          fontSize:
          <input
            type="text"
            value={this.state.fontSize}
            onChange={e => this.setState({ fontSize: e.target.value })}
          />
        </div>

        <div>
          fontWeight:
          <input
            type="text"
            value={this.state.fontWeight}
            onChange={e => this.setState({ fontWeight: e.target.value })}
          />
        </div>

        <div>
          lineHeight:
          <input
            type="text"
            value={this.state.lineHeight}
            onChange={e => this.setState({ lineHeight: e.target.value })}
          />
        </div>

        <div>
          <label>
            scaleToFit:
            <input
              type="checkbox"
              onChange={() =>
                this.setState(({ scaleToFit }) => ({
                  scaleToFit: !scaleToFit,
                }))
              }
              checked={this.state.scaleToFit}
            />
          </label>
        </div>

        <div>
          <label>
            axis orientation:
            <label>
              <input
                type="radio"
                value="left"
                onChange={e =>
                  this.setState({ axisOrientation: e.target.value, textAnchor: 'end', dx: -4 })
                }
                checked={this.state.axisOrientation === 'left'}
              />{' '}
              left
            </label>
            <label>
              <input
                type="radio"
                value="right"
                onChange={e =>
                  this.setState({ axisOrientation: e.target.value, textAnchor: 'start', dx: 4 })
                }
                checked={this.state.axisOrientation === 'right'}
              />{' '}
              right
            </label>
          </label>
        </div>
      </div>
    );
  }

  render() {
    const { tickSuffix, axisOrientation, ...tickLabelProps } = this.state;
    const margin = {
      left: axisOrientation === 'left' ? tickLabelProps.width + 20 : 8,
      top: 32,
      bottom: 32,
      right: axisOrientation === 'right' ? tickLabelProps.width + 20 : 8,
    };

    return (
      <div className="tick-demo">
        {this.renderControls()}

        <ResponsiveXYChart
          eventTrigger="container"
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear', domain: [1, 90] }}
          margin={margin}
          theme={chartTheme}
          snapTooltipToDataX
          snapTooltipToDataY
          showYGrid
        >
          {temperatureBands.map((data, i) => [
            <PatternLines
              id={`band-${i}`}
              key={`pattern-${data[0].key}`}
              height={2 + 2 * i}
              width={2 + 2 * i}
              stroke={allColors[bandColor][6]}
              strokeWidth={1}
              orientation={['diagonal']}
            />,
            <AreaSeries
              seriesKey={`band-${i}`}
              key={`band-${data[0].key}`}
              data={data}
              strokeWidth={0}
              stroke="transparent"
              fill={`url(#band-${i})`}
            />,
          ])}
          <YAxis
            numTicks={5}
            tickFormat={val => `${val} ${tickSuffix}`}
            tickLabelProps={() => tickLabelProps}
            tickValues={tickValues}
            orientation={axisOrientation}
          />
          <CrossHair
            fullHeight
            strokeDasharray=""
            showHorizontalLine={false}
            circleFill="white"
            circleStroke={allColors[bandColor][4]}
            stroke={allColors[bandColor][4]}
          />
        </ResponsiveXYChart>

        <style type="text/css">
          {`
          .tick-demo {
             display: flex;
             flex-direction: row;
             flex-wrap: wrap;
             align-items: center;
          }

          .tick-demo--form > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
        `}
        </style>
      </div>
    );
  }
}

export default TickLabelPlayground;
