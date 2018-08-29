import { Children } from 'react';

import collectDataFromChildSeries from './collectDataFromChildSeries';
// import collectExtentsFromChildSeries from './collectExtentsFromChildSeries';
import getChartDimensions from './getChartDimensions';
import getScaleForAccessor from './getScaleForAccessor';
import { componentName, isBarSeries, isCirclePackSeries } from './chartUtils';

const getX = d => d && d.x;
const xString = d => getX(d).toString();
const getY = d => d && d.y;
const yString = d => getY(d).toString();

export default function collectScalesFromProps(props) {
  const { xScale: xScaleObject, yScale: yScaleObject, children } = props;
  const { innerWidth, innerHeight } = getChartDimensions(props);
  const allData = collectDataFromChildSeries(children);

  // TODO could collect data extents from child series
  // which would support passing arbitrary x/y accessors
  // const [xExtent, yExtent] = collectExtentsFromChildSeries(children);
  // issues:
  //  voronoi transforms data via scale(getXorY(d))
  //    => Could be solved by transforming in data collection
  //  tooltip/crosshair transforms data via scale(getXorY(d))
  //    => could be solved by transforming in the mousemove call so series own it?

  const xScale = getScaleForAccessor({
    allData,
    minAccessor: d => (typeof d.x0 === 'undefined' ? d.x : d.x0),
    maxAccessor: d => (typeof d.x1 === 'undefined' ? d.x : d.x1),
    range: [0, innerWidth],
    ...xScaleObject,
  });

  const yScale = getScaleForAccessor({
    allData,
    minAccessor: d => (typeof d.y0 === 'undefined' ? d.y : d.y0),
    maxAccessor: d => (typeof d.y1 === 'undefined' ? d.y : d.y1),
    range: [innerHeight, 0],
    ...yScaleObject,
  });

  Children.forEach(children, Child => {
    // Child-specific scales or adjustments here
    const name = componentName(Child);
    if (isBarSeries(name)) {
      const { horizontal } = Child.props;
      const categoryScaleObject = horizontal ? yScaleObject : xScaleObject;
      if (categoryScaleObject.type !== 'band') {
        const categoryScale = horizontal ? yScale : xScale;
        const range = horizontal ? innerHeight : innerWidth;
        const dummyBand = getScaleForAccessor({
          allData,
          minAccessor: horizontal ? yString : xString,
          maxAccessor: horizontal ? yString : xString,
          type: 'band',
          rangeRound: [0, range],
          paddingOuter: 1,
        });

        const offset = dummyBand.bandwidth() / 2;
        categoryScale.range([offset, range - offset]);
        categoryScale.barWidth = dummyBand.bandwidth();
        categoryScale.offset = offset;
      }
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
