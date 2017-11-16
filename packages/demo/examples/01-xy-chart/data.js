import { cityTemperature, appleStock, genRandomNormalPoints, letterFrequency, genStats } from '@vx/mock-data';
import { theme } from '@data-ui/xy-chart';

export const timeSeriesData = appleStock.filter((d, i) => i % 120 === 0).map(d => ({
  x: new Date(d.date),
  y: d.close,
}));

export const categoricalData = letterFrequency.map(d => ({ x: d.letter, y: d.frequency }));

// stacked data
export const groupKeys = Object.keys(cityTemperature[0]).filter(attr => attr !== 'date');
export const stackedData = cityTemperature.slice(0, 12).map(d => ({
  // convert all keys to numbers
  ...(groupKeys.reduce((obj, key) => ({ ...obj, [key]: Number(d[key]) }), {})),
  x: d.date,
  y: groupKeys.reduce((ret, curr) => ret + Number(d[curr]), 0),
}));

export const groupedData = stackedData.slice(0, 6).map(d => ({
  ...d,
  y: Math.max(...groupKeys.map(attr => Number(d[attr]))),
}));

// point data
const n = 10;
export const pointData = genRandomNormalPoints(n).map(([x, y], i) => ({
  x,
  y,
  fill: theme.colors.categories[Math.floor(i / n)],
  size: Math.max(3, Math.random() * 10),
  label: (i % n) === 0 ? `(${parseInt(x, 10)},${parseInt(y, 10)})` : null,
}));

// band data
const stdDev = 0.1;
export const temperatureBands = groupKeys.map((city, cityIndex) => (
  cityTemperature.slice(0, 25).map((d) => {
    const y = Number(d[city]) - (20 * cityIndex);
    return {
      key: city,
      x: d.date,
      y,
      y0: y + (stdDev * y),
      y1: y - (stdDev * y),
    };
  })
));

export const priceBandData = {
  band: [
    { x: new Date('2017-06-01'), y0: 215, y1: 260 },
    { x: new Date('2017-06-02'), y0: 203, y1: 290 },
    { x: new Date('2017-06-03'), y0: 196, y1: 279 },
    { x: new Date('2017-06-04'), y0: 190, y1: 261 },
    { x: new Date('2017-06-05'), y0: 140, y1: 250 },
    { x: new Date('2017-06-06'), y0: 120, y1: 231 },
    { x: new Date('2017-06-07'), y0: 131, y1: 211 },
    { x: new Date('2017-06-08'), y0: 123, y1: 196 },
    { x: new Date('2017-06-09'), y0: 105, y1: 171 },
    { x: new Date('2017-06-10'), y0: 100, y1: 175 },
    { x: new Date('2017-06-11'), y0: 80, y1: 150 },
    { x: new Date('2017-06-12'), y0: 83, y1: 164 },
    { x: new Date('2017-06-13'), y0: 86, y1: 155 },
    { x: new Date('2017-06-14'), y0: 80, y1: 132 },
    { x: new Date('2017-06-15'), y0: 73, y1: 125 },
    { x: new Date('2017-06-16'), y0: 71, y1: 132 },
    { x: new Date('2017-06-17'), y0: 78, y1: 123 },
    { x: new Date('2017-06-18'), y0: 82, y1: 156 },
    { x: new Date('2017-06-19'), y0: 76, y1: 150 },
    { x: new Date('2017-06-20'), y0: 87, y1: 173 },
    { x: new Date('2017-06-21'), y0: 95, y1: 168 },
    { x: new Date('2017-06-22'), y0: 105, y1: 182 },
    { x: new Date('2017-06-23'), y0: 100, y1: 202 },
    { x: new Date('2017-06-24'), y0: 116, y1: 211 },
    { x: new Date('2017-06-25'), y0: 126, y1: 230 },
    { x: new Date('2017-06-26'), y0: 137, y1: 246 },
    { x: new Date('2017-06-27'), y0: 142, y1: 262 },
    { x: new Date('2017-06-28'), y0: 170, y1: 273 },
    { x: new Date('2017-06-29'), y0: 190, y1: 285 },
    { x: new Date('2017-06-30'), y0: 201, y1: 301 },
  ],
};

priceBandData.points = priceBandData.band.map(({ x, y0, y1 }) => ({
  x,
  // Introduce noise within the y0-y1 range
  y: ((y1 + y0) / 2) + ((Math.random() > 0.5 ? -1 : 1) * Math.random() * ((y1 - y0) / 4)),
}));

// interval data
const intervals = [[5, 8], [15, 19]];

export const intervalLineData = cityTemperature.slice(0, 25).map((d, i) => ({
  ...d,
  x: d.date,
  y: intervals.some(([i0, i1]) => i >= i0 && i <= i1) ? null : Number(d[groupKeys[0]]),
}));

export const intervalData = intervals.reduce((ret, [i0, i1]) => {
  ret.push({
    x0: cityTemperature[i0].date,
    x1: cityTemperature[i1].date,
  });
  return ret;
}, []);

// circle pack
const dateBetween = (startDate, endDate) => (
  new Date(
    startDate.getTime() + (Math.random() * (endDate.getTime() - startDate.getTime())),
  )
);

const start = new Date('2017-01-05');
const end = new Date('2017-02-05');
const minSize = 2;
const maxSize = 10;

export const circlePackData = Array(400).fill(null).map((_, i) => ({
  x: dateBetween(start, end),
  r: minSize + (Math.random() * (maxSize - minSize)),
  fillOpacity: Math.max(0.4, Math.random()),
  fill: theme.colors.categories[i % 2 === 0 ? 1 : 3],
}));

export const statsData = genStats(5);
