import React from 'react';
import { storiesOf } from '@kadira/storybook';

import Table from '@data-ui/data-table';

function generateTableData(size) {
  const row = {
    one: Math.random(1000) * 1000,
    two: Math.random(1000) * 2000,
    three: 'some string' + Math.random(1000) * 2000,
    four: 'and another string that might be kinda long'
  };
  return Array(size).fill(row);
}

const data = generateTableData(100);

storiesOf('data-table', module)
  .add('Basic', () => (
    <Table.Table
      orderedColumnKeys={['two', 'three', 'four', 'one']}
      data={data}
      height={400}
    />
  ));
