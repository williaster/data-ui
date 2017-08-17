import React from 'react';
import { range } from 'd3-array';

import { color, allColors } from '@data-ui/theme';

import {
  Sparkline,

  BarSeries,
  LineSeries,
  PointSeries,

  BandLine,
  HorizontalReferenceLine,
  VerticalReferenceLine,

  PatternLines,
  // LinearGradient,

  // withScreenSize,
} from '@data-ui/sparkline';

import readme from '../../node_modules/@data-ui/sparkline/README.md';

// @TODO separate file if we keep this
class DataProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [Math.random(), Math.random(), Math.random()],
      intervalId: null,
    };
  }

  componentDidMount() {
    const intervalId = window.setInterval(this.updateData.bind(this), 500);
    this.setState(() => ({ intervalId }));  // eslint-disable-line
  }

  componentWillUnmount() {
    window.clearInterval(this.state.intervalId);
  }

  updateData() {
    const { data } = this.state;
    let nextData = [...data];
    if (nextData.length < 20) {
      nextData.push(Math.random());
    } else {
      nextData = nextData.slice(1);
      nextData.push(Math.random());
    }
    this.setState(() => ({ data: nextData }));
  }

  render() {
    return this.props.children(this.state.data); // eslint-disable-line
  }
}

const sparklineProps = {
  ariaLabel: 'This is a Sparkline of...',
  width: 532,
  height: 100,
  margin: { top: 24, right: 64, bottom: 24, left: 64 },
};

const renderLabel = d => d.toFixed(2);

export default {
  usage: readme,
  examples: [
    {
      description: 'Sparkline',
      components: [
        Sparkline,
        BarSeries,
        LineSeries,
        PointSeries,
        HorizontalReferenceLine,
        VerticalReferenceLine,
        BandLine,
      ],
      example: () => (
        <div>
          <Sparkline
            {...sparklineProps}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <BarSeries
              fill={(d, i) => allColors.grape[i === 5 ? 8 : 2]}
              fillOpacity={0.8}
              renderLabel={(d, i) => (i === 5 ? d.toFixed(2) : null)}
            />
          </Sparkline>

          <br />

          <Sparkline
            {...sparklineProps}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <PatternLines
              id="area_pattern"
              height={4}
              width={4}
              stroke={allColors.cyan[8]}
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <LineSeries
              showArea
              stroke={allColors.cyan[5]}
              fill="url(#area_pattern)"
            />
            <PointSeries points={['all']} stroke={color.default} />
            <PointSeries
              points={['last']}
              fill={color.default}
              renderLabel={renderLabel}
              labelPosition="right"
            />
          </Sparkline>

          <br />

          <Sparkline
            {...sparklineProps}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <LineSeries
              stroke={color.categories[2]}
              strokeDasharray="2,2"
              strokeLinecap="butt"
            />
            <PointSeries
              points={['all']}
              size={3}
              fill={color.categories[2]}
              strokeWidth={0}
            />
            <PointSeries
              points={['min', 'max']}
              fill={color.categories[1]}
              size={5}
              stroke="#fff"
              renderLabel={renderLabel}
            />
          </Sparkline>

          <br />

          <Sparkline
            {...sparklineProps}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <HorizontalReferenceLine
              stroke={allColors.cyan[8]}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <LineSeries stroke={allColors.cyan[4]} />
            <PointSeries
              points={['first', 'last']}
              fill={allColors.cyan[7]}
              size={5}
              stroke="#fff"
              renderLabel={renderLabel}
              labelPosition={(d, i) => (i === 0 ? 'left' : 'right')}
            />
          </Sparkline>

          <br />

          <Sparkline
            {...sparklineProps}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <PatternLines
              id="band_pattern"
              height={6}
              width={6}
              stroke={allColors.grape[6]}
              strokeWidth={1}
              orientation={['diagonal']}
            />
            <BandLine fill="url(#band_pattern)" />
            <HorizontalReferenceLine
              stroke={allColors.grape[8]}
              strokeWidth={1}
              strokeDasharray="4 4"
              reference="median"
            />
            <VerticalReferenceLine
              reference="min"
              stroke={allColors.grape[3]}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <VerticalReferenceLine
              reference="max"
              stroke={allColors.grape[3]}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <LineSeries stroke={allColors.grape[7]} />
            <PointSeries
              points={['min', 'max']}
              fill={allColors.grape[3]}
              size={5}
              stroke="#fff"
              renderLabel={renderLabel}
            />
          </Sparkline>

          <br />

          <Sparkline
            {...sparklineProps}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <PatternLines
              id="band_pattern_hash"
              height={7}
              width={7}
              stroke={color.grays[5]}
              strokeWidth={1}
              orientation={['vertical', 'horizontal']}
            />
            <BandLine
              fill="url(#band_pattern_hash)"
              stroke={color.grays[5]}
              band={{
                from: { x: 0 },
                to: { x: 24 },
              }}
            />
            <HorizontalReferenceLine
              stroke={color.grays[8]}
              strokeWidth={1}
              strokeDasharray="4 4"
              reference="median"
            />
            <LineSeries stroke={color.grays[7]} />
            <PointSeries
              points={['min', 'max']}
              fill={color.grays[5]}
              size={5}
              stroke="#fff"
              renderLabel={renderLabel}
            />
          </Sparkline>
        </div>
      ),
    },
    {
      description: 'Updating',
      components: [Sparkline, LineSeries],
      example: () => (
        <DataProvider>
          {data => (
            <Sparkline
              ariaLabel="Random data"
              width={300}
              height={72}
              data={data}
            >
              <LineSeries showArea />
            </Sparkline>
          )}
        </DataProvider>
      ),
    },
  ],
};
