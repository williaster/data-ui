import { List } from 'immutable';
import React from 'react';
import { storiesOf } from '@kadira/storybook';

import mockData from '@vx/mock-data';
import Table from '@data-ui/data-table';

const dataList = List(mockData.browserUsage.slice(0, 100));
const columns = Object.keys(mockData.browserUsage[0]).slice(0, 4);

storiesOf('data-table', module)
  .add('Table', () => (
    <Table.Table
      dataList={dataList}
      orderedColumnKeys={columns}
      width={600}
      height={400}
      columnFlexGrow={1}
    />
  ))
  .add('SortableTable', () => (
    <Table.SortableTable
      dataList={dataList}
      orderedColumnKeys={columns}
      width={600}
      height={400}
      columnFlexGrow={1}
    />
  ));
