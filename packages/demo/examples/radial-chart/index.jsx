import mockData from '@vx/mock-data';
import React from 'react';
import { scaleOrdinal } from '@vx/scale';
import { LegendOrdinal } from '@vx/legend';

import { allColors, color } from '@data-ui/theme';
import { RadialChart, ArcSeries, ArcLabel } from '@data-ui/radial-chart';

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

const pinkColorScale = scaleOrdinal({ range: [...allColors.pink].reverse() });
const categoryColorScale = scaleOrdinal({ range: color.categories });

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
  fill: arc => pinkColorScale(arc.data.label),
  label: arc => `${(arc.data.value).toFixed(1)}%`,
  labelComponent: <ArcLabel fill="#fff" fontSize={10} />,
  innerRadius: radius => 0.35 * radius,
  outerRadius: radius => 0.6 * radius,
  labelRadius: radius => 0.47 * radius,
  stroke: '#fff',
  strokeWidth: 1,
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

export default [
  {
    description: '<RadialChart /> -- donut 🍩',
    example: () => (
      <div style={wrapperStyles}>
        <RadialChart {...chartProps}>
          <ArcSeries {...seriesProps} />
        </RadialChart>
        {PinkLegend}
      </div>
    ),
  },
  {
    description: '<RadialChart /> -- pie 🍰',
    example: () => (
      <div style={wrapperStyles}>
        <RadialChart {...chartProps}>
          <ArcSeries
            {...seriesProps}
            innerRadius={0}
            fill={arc => categoryColorScale(arc.data.label)}
          />
        </RadialChart>
        {CategoryLegend}
      </div>
    ),
  },
  {
    description: '<RadialChart /> -- outer labels 🍩',
    example: () => (
      <div style={wrapperStyles}>
        <RadialChart {...chartProps}>
          <ArcSeries
            {...seriesProps}
            fillOpacity={0.5}
            stroke={seriesProps.fill}
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
];
