import React from 'react';
import { range } from 'd3-array';

import {
  Sparkline,

  BarSeries,
  LineSeries,
  PointSeries,

  BandLine,
  ReferenceLine,

  // PatternLines,
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


export default {
  usage: readme,
  examples: [
    {
      description: 'Sparkline',
      components: [Sparkline, BarSeries, LineSeries, PointSeries, ReferenceLine, BandLine],
      example: () => (
        <div>
          <Sparkline
            ariaLabel="Random data"
            width={500}
            height={100}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <BarSeries />
          </Sparkline>
          <br />
          <Sparkline
            ariaLabel="Random data"
            width={500}
            height={100}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <LineSeries showArea showLine={false} />
            <PointSeries points={['all']} />
          </Sparkline>
          <br />
          <Sparkline
            ariaLabel="Random data"
            width={500}
            height={100}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <LineSeries />
            <PointSeries points={['all']} size={2} fill="#008489" strokeWidth={0} />
            <PointSeries points={['min', 'max']} fill="#d6336c" size={5} stroke="#fff" />
          </Sparkline>
          <br />
          <Sparkline
            ariaLabel="Random data"
            width={500}
            height={100}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <ReferenceLine stroke="#d6336c" strokeWidth={1} strokeDasharray="4 4" />
            <LineSeries stroke="#d6336c" />
            <PointSeries points={['first', 'last']} fill="#d6336c" size={5} stroke="#fff" />
          </Sparkline>
          <br />
          <Sparkline
            ariaLabel="Random data"
            width={500}
            height={100}
            data={range(25).map(() => (Math.random() * (Math.random() > 0.2 ? 1 : 2)))}
          >
            <BandLine />
            <ReferenceLine
              stroke="#767676"
              strokeWidth={1}
              strokeDasharray="4 4"
              reference="median"
            />
            <LineSeries stroke="#FFB400" />
            <PointSeries
              points={['min', 'max']}
              fill="#FFB400"
              size={5}
              stroke="#fff"
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
