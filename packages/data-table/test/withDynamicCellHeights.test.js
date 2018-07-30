import { List } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import Table from '../src/components/Table';
import withDynamicCellHeights from '../src/enhancers/withDynamicCellHeights';

const TableWithDynamicCellHeights = withDynamicCellHeights(Table);
const dataList = List([{ a: 'a', b: 'b' }, { a: 'a', z: 'z' }]); // eslint-disable-line babel/new-cap

describe('withDynamicCellHeights()', () => {
  const props = {
    width: 100,
    height: 100,
    dataList,
    orderedColumnKeys: ['a', 'b', 'z'],
    dynamicHeightColumnKeys: ['a'],
  };

  it('it should be defined', () => {
    expect(withDynamicCellHeights).toBeDefined();
  });

  it('it should render a Table', () => {
    const wrapper = shallow(<TableWithDynamicCellHeights {...props} />);
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('it should pass a deferredMeasurementCache and cellRendererByColumnKey props to the Table', () => {
    const wrapper = shallow(<TableWithDynamicCellHeights {...props} />);
    const RenderedTable = wrapper.find(Table);

    expect(RenderedTable.prop('deferredMeasurementCache')).toBeDefined();
    expect(typeof RenderedTable.prop('cellRendererByColumnKey')).toBe('object');
  });
});
