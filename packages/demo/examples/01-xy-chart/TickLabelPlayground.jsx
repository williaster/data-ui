import React from 'react';
import { allColors } from '@data-ui/theme/build/color';
import theme from '@data-ui/theme/build/chartTheme';
import {
  AreaSeries,
  CrossHair,
  LinearGradient,
  HorizontalReferenceLine,
  YAxis,
} from '@data-ui/xy-chart';

import ResponsiveXYChart from './ResponsiveXYChart';
import { timeSeriesData } from './data';

const color = 'blue';

const chartTheme = {
  ...theme,
  yAxisStyles: {
    ...theme.yAxisStyles,
    stroke: allColors[color][7],
    strokeWidth: 2,
  },
  yTickStyles: {
    ...theme.yTickStyles,
    stroke: allColors[color][7],
  },
};

const tickValues = [0, 100, 200, 300, 400];

class TickLabelPlayground extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tickSuffix: 'long suffix to see wrap',
      dx: 0,
      dy: 0,
      width: 100,
      angle: 0,
      scaleToFit: false,
      textAnchor: 'start',
      verticalAnchor: 'middle',
      fontSize: '0.9em',
      fontWeight: 200,
      lineHeight: '1em',
      fill: allColors[color][8],
    };

    this.animateAngle = this.animateAngle.bind(this);
  }

  componentDidMount() {
    this.animateAngle();
  }

  componentWillUnmount() {
    clearTimeout(this.angleTimeout);
  }

  animateAngle() {
    const nextAngle = this.state.angle >= 360 ? 0 : this.state.angle + 20;
    this.setState({ angle: nextAngle }, () => {
      if (nextAngle) {
        this.angleTimeout = setTimeout(this.animateAngle, 20);
      }
    });
  }

  renderControls() {
    const styles = {};
    return (
      <div className="tick-demo--form">
        <h4>Tick Label Props</h4>
        <div>
          tick suffix:
          <input
            type="text"
            style={styles.tickFormat}
            value={this.state.tickSuffix}
            onChange={e => this.setState({ tickSuffix: e.target.value })}
          />
        </div>

        <div>
          dx:
          <input
            type="range"
            style={styles.range}
            min="0"
            max="225"
            value={this.state.dx}
            onChange={e => this.setState({ dx: Number(e.target.value) })}
          />
          <input
            type="text"
            value={this.state.dx}
            onChange={e => this.setState({ dx: Number(e.target.value) })}
          />
        </div>

        <div>
          dy:
          <input
            type="range"
            style={styles.range}
            min="0"
            max="200"
            value={this.state.dy}
            onChange={e => this.setState({ dy: Number(e.target.value) })}
          />
          <input
            type="text"
            value={this.state.dy}
            onChange={e => this.setState({ dy: Number(e.target.value) })}
          />
        </div>

        <div>
          width:
          <input
            type="range"
            style={styles.range}
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
              onChange={e =>
                this.setState({
                  scaleToFit: !this.state.scaleToFit,
                })
              }
              checked={this.state.scaleToFit}
            />
          </label>
        </div>
      </div>
    );
  }

  render() {
    const { tickSuffix, ...tickLabelProps } = this.state;
    return (
      <div className="tick-demo">
        {this.renderControls()}

        <ResponsiveXYChart
          eventTrigger="container"
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
          margin={{ left: 8, top: 32, bottom: 64, right: tickLabelProps.width + 10 }}
          theme={chartTheme}
          snapTooltipToDataX
          snapTooltipToDataY
        >
          <LinearGradient id="area_gradient" from={allColors[color][8]} to={allColors[color][1]} />
          <AreaSeries
            seriesKey="one"
            data={timeSeriesData}
            fill="url(#area_gradient)"
            strokeWidth={3}
            stroke={allColors[color][7]}
          />
          {tickValues.map(value => (
            <HorizontalReferenceLine
              key={value}
              reference={value}
              stroke="white"
              strokeWidth={1.5}
            />
          ))}
          <YAxis
            numTicks={5}
            tickFormat={val => `$${val} ${tickSuffix}`}
            tickLabelProps={() => tickLabelProps}
            tickValues={tickValues}
          />
          <CrossHair
            showHorizontalLine={false}
            showVerticalLine={false}
            circleStroke={allColors[color][7]}
            circleFill="white"
          />
        </ResponsiveXYChart>

        <style type="text/css">{`
          .tick-demo {
             display: flex;
             flex-direction: row;
             flex-wrap: row;
          }

          .tick-demo--form > div {
            display: flex;
            justify-content: space-between;
            margin-right: 16px;
          }
        `}</style>
      </div>
    );
  }
}

export default TickLabelPlayground;
