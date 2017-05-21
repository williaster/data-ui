import React, {PropTypes} from 'react';

import {AxisLeft, AxisBottom} from '@vx/axis';
import {scaleTime, scaleLinear} from '@vx/scale';
import {Group} from '@vx/group';
import {Grid} from '@vx/grid';
import {LinePath} from '@vx/shape';
import {curveBasis} from '@vx/curve';

import {extent, max, zip, range} from 'd3-array';

import science from 'science';


function numTicksForHeight(height) {
  if (height <= 300) return 3;
  if (300 < height && height <= 600) return 5;
  return 10;
}

function numTicksForWidth(width) {
  if (width <= 300) return 2;
  if (300 < width && width <= 400) return 5;
  return 10;
}

// Make data point its own component for performance:
// https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
class DataPoint extends React.PureComponent {

  _onClick = () => {
    this.props.onClick(this.props.datum, this.props.i)
  };

  _onMouseEnter = () => {
    this.props.onMouseEnter(this.props.datum, this.props.i)
  };

  _onMouseLeave = () => {
    this.props.onMouseLeave(this.props.datum, this.props.i)
  };

  render() {
    let x = this.props.x, y = this.props.y;
    let xScale = this.props.xScale, yScale = this.props.yScale;
    return <circle
      key={`point-${this.props.i}`}
      fill="#aaa"
      cx={xScale(x(this.props.datum))}
      cy={yScale(y(this.props.datum))}
      onMouseEnter={this._onMouseEnter}
      onMouseLeave={this._onMouseLeave}
      onClick={this._onClick}
      r={this.props.hovered ? 6 : 4}
    />;
  }
}


class ScatterPlot extends React.Component {

  state = {
    hover: null
  };

  _setHover = (data, id) => {
    this.setState({hover: id});
  };

  _unsetHover = () => {
    this.setState({hover: null});
  };


  render() {

    let margin = this.props.margin;
    let width = this.props.width;
    let height = this.props.height;
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    let smooth = science.stats.loess().bandwidth(.2);

    let data = this.props.data;

    const x = this.props.x;
    const y = this.props.y;

    let xs = data.map(x);
    let ys = data.map(y);
    const smoothedData = zip(xs, smooth(range(0, ys.length, 1), ys));

    // scales
    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, x),
    });
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, max(data, y)],
      nice: true,
    });

    // scale tick formats
    const identity = x => x;
    const yFormat = yScale.tickFormat ? yScale.tickFormat() : identity;
    const xFormat = xScale.tickFormat ? xScale.tickFormat() : identity;

    return (
      <div style={{position: "relative"}}>
        <svg width={width} height={height}>
          <Grid
            top={margin.top}
            left={margin.left}
            xScale={xScale}
            yScale={yScale}
            stroke='#333'
            width={xMax}
            height={yMax}
            numTicksRows={numTicksForHeight(height)}
            numTicksColumns={numTicksForWidth(width)}
          />
          <Group top={margin.top} left={margin.left}>
            {this.props.curve && <LinePath
              data={smoothedData}
              xScale={xScale}
              yScale={yScale}
              x={d => d[0]}
              y={d => d[1]}
              stroke='#fd5c63'
              strokeWidth={2}
              curve={curveBasis}
            />}
            {data.map((point, i) =>
              <DataPoint
                key={i}
                datum={point} i={i}
                x={x} y={y} xScale={xScale} yScale={yScale}
                onClick={this.props.onPointClick}
                onMouseEnter={this._setHover} onMouseLeave={this._unsetHover}
                hovered={this.state.hover === i}
              />
            )}
          </Group>

          <AxisLeft
            top={margin.top}
            left={margin.left}
            scale={yScale}
            hideZero
            numTicks={numTicksForHeight(height)}
            label='value'
            stroke='#1b1a1e'
            tickTextFill='#333'
            tickFormat={yFormat}
          />
          <AxisBottom
            top={height - margin.bottom}
            left={margin.left}
            scale={xScale}
            numTicks={numTicksForWidth(width)}
            label={'time'}
            stroke='#1b1a1e'
            tickStroke='#1b1a1e'
            tickTextFill='#333'
            tickFormat={xFormat}
          />
        </svg>
        {this.props.onPointHover && this.state.hover !== null &&
        <div style={{
          position: "absolute",
          left: margin.left + xScale(x(data[this.state.hover])),
          top: margin.top + yScale(y(data[this.state.hover])),
          pointerEvents: "none"
        }}>
          {React.createElement(this.props.onPointHover, data[this.state.hover])}
        </div>}
      </div>);
  }
}


export default ScatterPlot;