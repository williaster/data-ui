import React from 'react';
import { utcFormat } from 'd3-time-format';

import {
  AreaSeries,
  StackedBarSeries,
  CrossHair,
  IntervalSeries,
  PatternLines,
  XAxis,
  XYChart,
  theme,
  withScreenSize,
} from '@data-ui/xy-chart';

const PATTERN_ID = 'linked_pattern';
const formatDate = utcFormat('%Y');
const generateY = () => Math.max(10, Math.random() * 50);

const data = [
  { x: new Date('2010-01-01 UTC'), y: generateY() },
  { x: new Date('2011-01-01 UTC'), y: generateY() },
  { x: new Date('2012-01-01 UTC'), y: generateY() },
  { x: new Date('2013-01-01 UTC'), y: generateY() },
  { x: new Date('2014-01-01 UTC'), y: generateY() },
  { x: new Date('2015-01-01 UTC'), y: generateY() },
  { x: new Date('2016-01-01 UTC'), y: generateY() },
  { x: new Date('2017-01-01 UTC'), y: generateY() },
  { x: new Date('2018-01-01 UTC'), y: generateY() },
  { x: new Date('2019-01-01 UTC'), y: generateY() },
  { x: new Date('2020-01-01 UTC'), y: generateY() },
];

const tickValues = data.map(d => d.x);

const stackKeys = ['a', 'b', 'c'];
const stackFills = theme.colors.categories.slice(2);

const stackedData = data.map(d => {
  let total = 1;

  return stackKeys.reduce((ret, key, i) => {
    const fraction = i === stackKeys.length - 1 ? total : 0.33;
    total -= fraction;

    return { ...ret, [key]: fraction * ret.y };
  }, d);
});

const getYForKey = (d, key) => {
  const index = stackKeys.indexOf(key);

  return stackKeys.slice(0, index + 1).reduce((sum, currKey) => sum + d[currKey], 0);
};

const areaChartProps = {
  xScale: { type: 'time' },
  yScale: { type: 'linear' },
  margin: { top: 6, left: 16, right: 16, bottom: 24 },
};

const stackedChartProps = {
  xScale: { type: 'band', paddingInner: 0.1 },
  yScale: { type: 'linear' },
  margin: { top: 6, left: 16, right: 16, bottom: 24 },
};

class LinkedXYCharts extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.state = {
      selectedDatum: null,
      mousedOverDatum: null,
      mousedOverKey: null,
    };
  }

  handleClick({ datum }) {
    this.setState(({ selectedDatum }) => ({
      selectedDatum: datum === selectedDatum ? null : datum,
    }));
  }

  handleMouseMove({ datum, seriesKey }) {
    if (this.state.mousedOverDatum !== datum || this.state.mousedOverKey !== seriesKey) {
      this.setState(() => ({
        mousedOverDatum: datum,
        mousedOverKey: seriesKey,
      }));
    }
  }

  handleMouseLeave() {
    this.setState(() => ({ mousedOverDatum: null, mousedOverKey: null }));
  }

  render() {
    const { screenWidth } = this.props; // eslint-disable-line react/prop-types
    const { mousedOverDatum, mousedOverKey, selectedDatum } = this.state;
    const width = Math.max(400, Math.min(700, screenWidth / 1.5));
    const height = 100;

    const intervalData = selectedDatum
      ? [
          {
            x0: selectedDatum.x,
            x1: new Date(
              new Date(selectedDatum.x).setFullYear(new Date(selectedDatum.x).getFullYear() + 1),
            ),
          },
        ]
      : null;

    const crossHairData = mousedOverDatum
      ? { datum: { ...mousedOverDatum, y: mousedOverDatum[mousedOverKey] } }
      : null;

    const stackCrossHairData = mousedOverDatum
      ? {
          datum: {
            ...mousedOverDatum,
            y: getYForKey(mousedOverDatum, mousedOverKey),
          },
        }
      : null;

    return (
      <div
        style={{
          fontFamily: theme.labelStyles.fontFamily,
          fontSize: 12,
          color: theme.colors.grays[6],
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <svg width={0} height={0}>
          <PatternLines
            id={PATTERN_ID}
            height={6}
            width={6}
            stroke={theme.colors.darkGray}
            strokeWidth={1}
            orientation={['diagonal']}
          />
        </svg>

        <XYChart
          ariaLabel="test"
          {...stackedChartProps}
          width={width}
          height={height * 3}
          theme={theme}
          tooltipData={stackCrossHairData}
        >
          <StackedBarSeries
            fillOpacity={0.9}
            data={stackedData}
            stackKeys={stackKeys}
            stackFills={stackFills}
            stroke={theme.colors.darkGray}
            strokeWidth={0.5}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick}
          />
          {selectedDatum && (
            <StackedBarSeries
              data={[selectedDatum]}
              stackKeys={['y']}
              stackFills={[`url(#${PATTERN_ID})`]}
              disableMouseEvents
            />
          )}
          {stackCrossHairData && (
            <CrossHair
              fullHeight
              showHorizontalLine={false}
              circleFill={stackFills[stackKeys.indexOf(mousedOverKey)]}
            />
          )}
          <XAxis tickFormat={formatDate} />
        </XYChart>

        {stackKeys.map((seriesKey, stackIndex) => (
          <XYChart
            key={seriesKey}
            ariaLabel={seriesKey}
            {...areaChartProps}
            width={width}
            height={height}
            theme={theme}
            tooltipData={crossHairData}
          >
            <XAxis tickFormat={formatDate} tickValues={tickValues} />
            <AreaSeries
              data={stackedData.map(d => ({ ...d, y: d[seriesKey] }))}
              fill={stackFills[stackIndex]}
              fillOpacity={0.9}
              strokeWidth={1}
              stroke={stackFills[stackIndex]}
              onMouseMove={({ datum }) => {
                this.handleMouseMove({ datum, seriesKey });
              }}
              onMouseLeave={this.handleMouseLeave}
            />
            {intervalData && (
              <IntervalSeries fill={`url(#${PATTERN_ID})`} opacity={0.3} data={intervalData} />
            )}
            {mousedOverDatum && (
              <CrossHair
                fullHeight
                showHorizontalLine={false}
                showCircle={seriesKey === mousedOverKey}
                circleFill={stackFills[stackIndex]}
              />
            )}
          </XYChart>
        ))}
      </div>
    );
  }
}

export default withScreenSize(LinkedXYCharts);
