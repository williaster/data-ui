import { scaleLinear } from '@vx/scale';
import computeCirclePack from '../../src/utils/computeCirclePack';

describe('computeCirclePack', () => {
  const mockData = [
    { x: 10, size: 1, id: '1' },
    { x: 9, size: 3, id: '2' },
    { x: 1, size: 5, id: '3' },
    { x: 100, size: 5, id: '4' },
    { x: 3, size: 5, id: '5' },
  ];

  const xScale = scaleLinear({
    range: [0, 100],
    domain: [1, 100],
  });

  it('it should be defined', () => {
    expect(computeCirclePack).toBeDefined();
  });

  it('input data length should match output data length', () => {
    const output = computeCirclePack(mockData, xScale);
    expect(output).toHaveLength(mockData.length);
  });

  it('input data with lower x values should have lower x values in output', () => {
    const output = computeCirclePack(mockData, xScale);
    expect(output).toHaveLength(mockData.length);
  });

  it('numeric y values should be added to output data', () => {
    expect.assertions(mockData.length);

    const output = computeCirclePack(mockData, xScale);
    output.forEach(d => {
      expect(d.y).toEqual(expect.any(Number));
    });
  });

  it('x, size, and other datum properties should be copied to output data', () => {
    expect.assertions(mockData.length);

    const output = computeCirclePack(mockData, xScale);
    output.forEach(outputDatum => {
      const inputIndex = mockData.findIndex(inputDatum => inputDatum.id === outputDatum.id);
      const inputDatum = mockData[inputIndex];
      expect(Object.keys(outputDatum)).toEqual(expect.arrayContaining(Object.keys(inputDatum)));
    });
  });

  it('input datum should not be modified', () => {
    expect.assertions(mockData.length);

    const output = computeCirclePack(mockData, xScale);
    output.forEach(outputDatum => {
      const inputIndex = mockData.findIndex(inputDatum => inputDatum.id === outputDatum.id);
      const inputDatum = mockData[inputIndex];
      expect(outputDatum).not.toBe(inputDatum);
    });
  });
});
