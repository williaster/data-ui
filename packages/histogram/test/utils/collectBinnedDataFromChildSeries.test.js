import React from 'react';
import collectBinnedDataFromChildSeries from '../../src/utils/collectBinnedDataFromChildSeries';

describe('collectDataFromChildSeries', () => {
  function FauxAxis() { return null; }
  function FauxSeries() { return null; }

  const rawData = [1, 2, 2, 3, 3, 3];

  const binnedData = [
    { bin0: 0, bin1: 1, count: 0 },
    { bin0: 1, bin1: 2, count: 1 },
    { bin0: 2, bin1: 3, count: 2 },
    { bin0: 3, bin1: 4, count: 3 },
  ];
  const childrenWithRawData = [
    <FauxSeries rawData={rawData} />,
    <FauxSeries rawData={rawData} />,
    <FauxAxis rawData={rawData} />,
  ];

  const childrenWithBinnedData = [
    <FauxSeries binnedData={binnedData.map(d => ({ ...d }))} />,
    <FauxSeries binnedData={binnedData.map(d => ({ ...d }))} />,
    <FauxAxis binnedData={binnedData.map(d => ({ ...d }))} />,
  ];

  test('it should be defined', () => {
    expect(collectBinnedDataFromChildSeries).toBeDefined();
  });

  test('it should used binnedData if children already have it', () => {
    const binnedDataByIndex = collectBinnedDataFromChildSeries({
      children: childrenWithBinnedData,
      binType: 'numeric',
    });

    binnedData.forEach((bin, i) => {
      expect(binnedDataByIndex[0][i]).toMatchObject(bin);
      expect(binnedDataByIndex[1][i]).toMatchObject(bin);
    });
  });

  test('it should bin data if children have rawData', () => {
    const binnedDataByIndex = collectBinnedDataFromChildSeries({
      children: childrenWithRawData,
      binType: 'numeric',
      valueAccessor: d => d,
      binValues: [0, 1, 2, 3, 4],
    });

    binnedData.forEach((bin, i) => {
      expect(binnedDataByIndex[0][i]).toMatchObject(bin);
      expect(binnedDataByIndex[1][i]).toMatchObject(bin);
    });
  });
});
