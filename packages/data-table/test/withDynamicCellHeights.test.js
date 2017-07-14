import { List } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import Table from '../src/components/Table';
import withDynamicCellHeights from '../src/enhancers/withDynamicCellHeights';

const TableWithDynamicCellHeights = withDynamicCellHeights(Table);
const dataList = List([{ a: 'a', b: 'b' }, { a: 'a', z: 'z' }]);

describe('withDynamicCellHeights()', () => {
  const props = {
    width: 100,
    height: 100,
    dataList,
    orderedColumnKeys: ['a', 'b', 'z'],
    dynamicHeightColumnKeys: ['a'],
  };

  test('it should be defined', () => {
    expect(withDynamicCellHeights).toBeDefined();
  });

  test('it should render a Table', () => {
    const wrapper = shallow(<TableWithDynamicCellHeights {...props} />);
    expect(wrapper.find(Table).length).toBe(1);
  });

  test('it should pass a deferredMeasurementCache and cellRendererByColumnKey props to the Table', () => {
    const wrapper = shallow(<TableWithDynamicCellHeights {...props} />);
    const RenderedTable = wrapper.find(Table);

    expect(RenderedTable.prop('deferredMeasurementCache')).toBeDefined();
    expect(typeof RenderedTable.prop('cellRendererByColumnKey')).toBe('object');
  });
});
