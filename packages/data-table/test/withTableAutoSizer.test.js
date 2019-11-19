import { AutoSizer } from 'react-virtualized';
import { List } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import withTableAutoSizer from '../src/enhancers/withTableAutoSizer';
import Table from '../src/components/Table';

const TableWithAutoSizer = withTableAutoSizer(Table);
// eslint-disable-next-line babel/new-cap
const dataList = List([{ str: 'a', num: 5 }, { str: 'c', num: 3 }, { str: 'b', num: 0 }]);

describe('withTableAutoSizer()', () => {
  const props = {
    width: 100,
    height: 100,
    dataList,
    orderedColumnKeys: ['str', 'num'],
  };

  it('it should be defined', () => {
    expect(withTableAutoSizer).toBeDefined();
  });

  it('it should render an AutoSizer', () => {
    const wrapper = shallow(<TableWithAutoSizer {...props} />);
    expect(wrapper.find(AutoSizer)).toHaveLength(1);
  });
});
