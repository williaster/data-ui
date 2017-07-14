import mockData from '@vx/mock-data';
import React from 'react';
import { LegendOrdinal } from '@vx/legend';

import {
  RadialChart,
  ArcSeries,
  ArcLabel,
  singleHueScaleFactory,
  multiHueScaleFactory,
} from '@data-ui/radial-chart';

import readme from '../../node_modules/@data-ui/radial-chart/README.md';

const { browserUsage } = mockData;

const browsersLast = browserUsage[browserUsage.length - 1];
const browserFractions = Object.entries(browsersLast)
  .filter(([key]) => key !== 'date')
  .map(([key, fraction]) => ({
    value: parseFloat(fraction),
    label: key,
  }));

const width = 400;
const height = 400;

const pinkColorScale = singleHueScaleFactory('pink');
const categoryColorScale = multiHueScaleFactory();

const wrapperStyles = { display: 'flex', alignItems: 'center' };

const chartProps = {
  ariaLabel: 'This is a radial-chart chart of...',
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  width,
  height,
};

const seriesProps = {
  data: browserFractions,
  pieValue: d => d.value,
  label: arc => `${(arc.data.value).toFixed(1)}%`,
  labelComponent: <ArcLabel fill="#fff" fontSize={10} />,
  innerRadius: radius => 0.35 * radius,
  outerRadius: radius => 0.6 * radius,
  labelRadius: radius => 0.47 * radius,
  stroke: '#fff',
  strokeWidth: 1.5,
};

const PinkLegend = (
  <LegendOrdinal
    direction="column"
    scale={pinkColorScale}
    shape="rect"
    fill={({ datum }) => pinkColorScale(datum)}
    labelFormat={label => label}
  />
);

const CategoryLegend = (
  <LegendOrdinal
    direction="column"
    scale={categoryColorScale}
    shape="circle"
    fill={({ datum }) => categoryColorScale(datum)}
    labelFormat={label => label}
  />
);

export default {
  usage: readme,
  examples: [
    {
      description: 'RadialChart -- pie 🍰',
      components: [RadialChart, ArcSeries, LegendOrdinal],
      example: () => (
        <div style={wrapperStyles}>
          <RadialChart {...chartProps}>
            <ArcSeries
              {...seriesProps}
              labelComponent={<ArcLabel stroke="#222" fill="#fff" fontSize={10} />}
              innerRadius={0}
              fill={arc => categoryColorScale(arc.data.label)}
            />
          </RadialChart>
          {CategoryLegend}
        </div>
      ),
    },
    {
      description: 'RadialChart -- outer label donut 🍩',
      components: [ArcSeries, ArcLabel],
      example: () => (
        <div style={wrapperStyles}>
          <RadialChart {...chartProps}>
            <ArcSeries
              {...seriesProps}
              fill={arc => pinkColorScale(arc.data.label)}
              fillOpacity={0.5}
              stroke={arc => pinkColorScale(arc.data.label)}
              strokeWidth={2}
              padAngle={0.03}
              cornerRadius={5}
              labelComponent={
                <ArcLabel
                  fontSize={10}
                  textAnchor={arc => (
                    ((arc.endAngle + arc.startAngle) / 2) > 3.14 ? 'end' : 'start'
                  )}
                  fill={arc => pinkColorScale(arc.data.label)}
                />
              }
              labelRadius={radius => 0.65 * radius}
            />
          </RadialChart>
          {PinkLegend}
        </div>
      ),
    },
    {
      description: 'RadialChart -- default colors 🍩',
      components: [RadialChart, ArcSeries],
      example: () => (
        <div style={wrapperStyles}>
          <RadialChart {...chartProps}>
            <ArcSeries {...seriesProps} />
          </RadialChart>
        </div>
      ),
    },
  ],
};
