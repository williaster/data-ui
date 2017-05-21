import React from 'react';
import { ScatterPlot } from '@data-ui/data-plots';
import * as mockData from '@vx/mock-data';

const defaultMargin = {
  top: 20,
  left: 60,
  right: 40,
  bottom: 60,
};

const dateData = mockData.genDateValue(50);

export default [
  {
    description: 'default scatter plot',
    example: () => (
      <div>
        <ScatterPlot
          width={800} height={300} margin={defaultMargin}
          data={dateData} x={d => d.date} y={d => d.value}
        />
      </div>
    ),
  }, {
    description: 'scatter plot with trend curve',
    example: () => (
      <div>
        <ScatterPlot
          width={800} height={300} margin={defaultMargin}
          data={dateData} x={d => d.date} y={d => d.value}
          curve
        />
      </div>
    ),
  }, {
    description: 'scatter plot with mouseover tooltip',
    example: () => (
      <div>
        <ScatterPlot
          width={800} height={300} margin={defaultMargin}
          data={dateData} x={d => d.date} y={d => d.value}
          curve onPointHover={({ date, value }) => <p>{`${value}`}</p>}
        />
      </div>
    ),
  },
];
