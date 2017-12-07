import { Children } from 'react';

import collectDataFromChildSeries from './collectDataFromChildSeries';
import getChartDimensions from './getChartDimensions';
import getScaleForAccessor from './getScaleForAccessor';
import { componentName, isBarSeries, isCirclePackSeries } from './chartUtils';

const getX = d => d && d.x;
const xString = d => getX(d).toString();

export default function collectScalesFromProps(props) {
  const { xScale: xScaleObject, yScale: yScaleObject, children } = props;
  const { innerWidth, innerHeight } = getChartDimensions(props);
  const { allData } = collectDataFromChildSeries(children);

  const xScale = getScaleForAccessor({
    allData,
    minAccessor: d => (typeof d.x0 !== 'undefined' ? d.x0 : d.x),
    maxAccessor: d => (typeof d.x1 !== 'undefined' ? d.x1 : d.x),
    range: [0, innerWidth],
    ...xScaleObject,
  });

  const yScale = getScaleForAccessor({
    allData,
    minAccessor: d => (typeof d.y0 !== 'undefined' ? d.y0 : d.y),
    maxAccessor: d => (typeof d.y1 !== 'undefined' ? d.y1 : d.y),
    range: [innerHeight, 0],
    ...yScaleObject,
  });

  Children.forEach(children, (Child) => { // Child-specific scales or adjustments here
    const name = componentName(Child);
    if (isBarSeries(name) && xScaleObject.type !== 'band') {
      const dummyBand = getScaleForAccessor({
        allData,
        minAccessor: xString,
        maxAccessor: xString,
        type: 'band',
        rangeRound: [0, innerWidth],
        paddingOuter: 1,
      });

      const offset = dummyBand.bandwidth() / 2;
      xScale.range([offset, innerWidth - offset]);
      xScale.barWidth = dummyBand.bandwidth();
      xScale.offset = offset;
    }
    if (isCirclePackSeries(name)) {
      yScale.domain([-innerHeight / 2, innerHeight / 2]);
    }
  });

  return {
    xScale,
    yScale,
  };
}
