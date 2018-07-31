import React from 'react';
import collectDataFromChildSeries from '../../src/utils/collectDataFromChildSeries';

describe('collectDataFromChildSeries', () => {
  function FauxAxis() {
    return null;
  }
  function FauxSeries() {
    return null;
  }

  const childrenWithRawData = [
    <FauxSeries key="1" rawData={[0]} />,
    <FauxSeries key="2" rawData={[1]} />,
    <FauxSeries key="3" rawData={[2]} />,
    <FauxAxis key="4" rawData={[0]} />,
  ];

  const childrenWithBinnedData = [
    <FauxSeries key="1" binnedData={[0]} />,
    <FauxSeries key="2" binnedData={[1]} />,
    <FauxSeries key="3" binnedData={[2]} />,
    <FauxAxis key="4" binnedData={[0]} />,
  ];

  it('should be defined', () => {
    expect(collectDataFromChildSeries).toBeDefined();
  });

  it(`it should return an object with allBinnedData,
     allRawData, binnedDataByIndex, and rawDataByIndex keys`, () => {
    const result = collectDataFromChildSeries(childrenWithBinnedData);

    expect(result).toEqual(
      expect.objectContaining({
        allBinnedData: expect.any(Array),
        allRawData: expect.any(Array),
        binnedDataByIndex: expect.any(Object),
        rawDataByIndex: expect.any(Object),
      }),
    );
  });

  it('should ignore non-Series children', () => {
    const raw = collectDataFromChildSeries(childrenWithRawData);
    const binned = collectDataFromChildSeries(childrenWithRawData);

    expect(Object.keys(raw.rawDataByIndex)).toHaveLength(3);
    expect(Object.keys(binned.rawDataByIndex)).toHaveLength(3);
  });

  it('should work with no children', () => {
    const raw = collectDataFromChildSeries([]);
    const binned = collectDataFromChildSeries([]);

    expect(Object.keys(raw.rawDataByIndex)).toHaveLength(0);
    expect(Object.keys(binned.rawDataByIndex)).toHaveLength(0);
  });

  it('should bin rawData', () => {
    const result = collectDataFromChildSeries(childrenWithRawData);
    expect(result.rawDataByIndex[0]).toEqual([0]);
    expect(result.rawDataByIndex[1]).toEqual([1]);
    expect(result.rawDataByIndex[2]).toEqual([2]);
    expect(result.binnedDataByIndex).toEqual({});
  });

  it('should bin binnedData', () => {
    const result = collectDataFromChildSeries(childrenWithBinnedData);
    expect(result.binnedDataByIndex[0]).toEqual([0]);
    expect(result.binnedDataByIndex[1]).toEqual([1]);
    expect(result.binnedDataByIndex[2]).toEqual([2]);
    expect(result.rawDataByIndex).toEqual({});
  });

  it('should concatenate all data', () => {
    const raw = collectDataFromChildSeries(childrenWithRawData);
    const binned = collectDataFromChildSeries(childrenWithBinnedData);

    expect(raw.allRawData).toEqual(expect.arrayContaining([0, 1, 2]));
    expect(raw.allBinnedData).toEqual([]);

    expect(binned.allBinnedData).toEqual(expect.arrayContaining([0, 1, 2]));
    expect(binned.allRawData).toEqual([]);
  });
});
