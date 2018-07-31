import { List } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import { WindowScroller } from 'react-virtualized';

import withWindowScroller from '../src/enhancers/withWindowScroller';
import Table from '../src/components/Table';

const TableWithWindowScroller = withWindowScroller(Table);
const dataList = List([{ str: 'a', num: 5 }, { str: 'c', num: 3 }, { str: 'b', num: 0 }]); // eslint-disable-line babel/new-cap

describe('withTableAutoSizer()', () => {
  const props = {
    width: 100,
    height: 100,
    dataList,
    orderedColumnKeys: ['str', 'num'],
  };

  it('it should be defined', () => {
    expect(withWindowScroller).toBeDefined();
  });

  it('it should render an WindowScroller', () => {
    const wrapper = shallow(<TableWithWindowScroller {...props} />);
    expect(wrapper.find(WindowScroller)).toHaveLength(1);
  });
});
