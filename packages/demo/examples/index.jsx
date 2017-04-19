import { List } from 'immutable';
import React from 'react';
import { storiesOf } from '@kadira/storybook';

import mockData from '@vx/mock-data';
import {
  Table,
  FilterableTable,
  withSorting,
} from '@data-ui/data-table';

const dataList = List(mockData.browserUsage);
const allColumns = Object.keys(mockData.browserUsage[0]);
const someColumns = allColumns.slice(0, 4);

storiesOf('data-table', module)
  .add('Default Table', () => (
    <Table
      dataList={dataList}
      orderedColumnKeys={someColumns}
      width={700}
      height={400}
      columnWidth={600}
    />
  ))
  .add('Flex last column', () => (
    <Table
      dataList={dataList}
      orderedColumnKeys={someColumns.slice(0, 2)}
      width={700}
      height={400}
      columnWidth={100}
      flexLastColumn
    />
  ))
  .add('Table with horizontal scroll', () => (
    <div style={{ width: 700, overflow: 'auto' }}>
      <Table
        dataList={dataList}
        orderedColumnKeys={allColumns}
        width={3000}
        height={400}
        columnWidth={200}
        columnFlexGrow={1}
      />
    </div>
  ))
  .add('SortableTable', () => {
    const SortableTable = withSorting(Table);
    return (
      <SortableTable
        dataList={dataList}
        orderedColumnKeys={someColumns}
        width={700}
        height={400}
        columnFlexGrow={1}
      />
    );
  })
  .add('FilterableTable', () => (
    <FilterableTable
      dataList={dataList}
      orderedColumnKeys={someColumns}
      width={700}
      height={400}
      columnFlexGrow={1}
    />
  ))
  .add('FilterableSortableTable', () => {
    const SortableFilterableTable = withSorting(FilterableTable);
    return (
      <SortableFilterableTable
        dataList={dataList}
        orderedColumnKeys={someColumns}
        width={700}
        height={400}
        columnFlexGrow={1}
      />
    );
  });
