import { List } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import withSorting from '../src/enhancers/withSorting';
import Table from '../src/components/Table';

const TableWithSorting = withSorting(Table);
// eslint-disable-next-line babel/new-cap
const dataList = List([{ str: 'a', num: 5 }, { str: 'c', num: 3 }, { str: 'b', num: 0 }]);

describe('withSorting()', () => {
  const props = {
    width: 100,
    height: 100,
    dataList,
    orderedColumnKeys: ['str', 'num'],
  };

  it('it should be defined', () => {
    expect(withSorting).toBeDefined();
  });

  it('it should render a Table', () => {
    const wrapper = shallow(<TableWithSorting {...props} />);
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('it should pass sort, sorbBy, sortDirection, and dataList props to the wrapped Table', () => {
    const wrapper = shallow(<TableWithSorting {...props} />);
    const RenderedTable = wrapper.find(Table);

    expect(typeof RenderedTable.prop('sort')).toBe('function');
    expect(RenderedTable.prop('sortBy')).toBeNull();
    expect(RenderedTable.prop('sortDirection')).toBeNull();
    expect(RenderedTable.prop('dataList') instanceof List).toBe(true);
  });

  it('it should do an initial sort if initialSortBy and initialSortDirection are passed', () => {
    let wrapper = shallow(<TableWithSorting {...props} />);
    let RenderedTable = wrapper.find(Table);
    let data = RenderedTable.prop('dataList');

    expect(data.get(0).str).toBe('a');
    expect(data.get(0).num).toBe(5);

    wrapper = shallow(
      <TableWithSorting {...props} initialSortBy="str" initialSortDirection="DESC" />,
    );
    RenderedTable = wrapper.find(Table);
    data = RenderedTable.prop('dataList');

    expect(data.get(0).str).toBe('c');
    expect(data.get(0).num).toBe(3);
    expect(RenderedTable.prop('sortBy')).toBe('str');
    expect(RenderedTable.prop('sortDirection')).toBe('DESC');

    wrapper = shallow(
      <TableWithSorting {...props} initialSortBy="num" initialSortDirection="ASC" />,
    );
    RenderedTable = wrapper.find(Table);
    data = RenderedTable.prop('dataList');

    expect(data.get(0).str).toBe('b');
    expect(data.get(0).num).toBe(0);
  });
});
