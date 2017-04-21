import { List } from 'immutable';
import React from 'react';
import { storiesOf } from '@kadira/storybook';

import mockData from '@vx/mock-data';

import {
  Table,
  withDynamicCellHeights,
  withSorting,
  withTableAutoSizer,
} from '@data-ui/data-table';

import { tableStyles, sorableTableStyles } from './data-table/tableStyles';
import FilterableTable from './data-table/FilterableTable';

const dataList = List(mockData.browserUsage);
const allColumns = Object.keys(mockData.browserUsage[0]);
const someColumns = allColumns.slice(0, 4);

// @TODO split examples into files by package (at least)
storiesOf('data-table', module)
  .add('Default Table', () => (
    <Table
      dataList={dataList}
      orderedColumnKeys={someColumns}
      width={700}
      height={400}
      columnWidth={600}
      styles={tableStyles}
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
      styles={tableStyles}
    />
  ))
  .add('withTableAutoSizer', () => {
    const AutoSizedTable = withTableAutoSizer(Table);
    return ( // storybook container doesn't set an explicit size
      <div style={{ height: 500, background: 'pink' }}>
        <AutoSizedTable
          dataList={dataList}
          orderedColumnKeys={someColumns}
          columnFlexGrow={1}
          styles={tableStyles}
        />
      </div>
    );
  })
  .add('withTableAutoSizer, width only', () => {
    const AutoSizedTable = withTableAutoSizer(Table);
    return (
      <AutoSizedTable
        dataList={dataList}
        orderedColumnKeys={someColumns}
        height={300}
        disableHeight
        columnFlexGrow={1}
        styles={tableStyles}
      />
    );
  })
  .add('withDynamicCellHeights', () => {
    const DynamicCellHeight = withTableAutoSizer(withDynamicCellHeights(Table));
    return (
      <DynamicCellHeight
        dataList={dataList}
        orderedColumnKeys={someColumns}
        dynamicHeightColumnKeys={someColumns.slice(0, 1)}
        height={600}
        columnFlexGrow={1}
        styles={tableStyles}
      />
    );
  })
  .add('Table with horizontal scroll', () => (
    <div style={{ width: 700, overflow: 'auto' }}>
      <Table
        dataList={dataList}
        orderedColumnKeys={allColumns}
        width={3000}
        height={400}
        columnWidth={200}
        columnFlexGrow={1}
        styles={tableStyles}
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
        styles={sorableTableStyles}
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
      styles={tableStyles}
    />
  ))
  .add('FilterableSortableTable', () => {
    const SortableFilterableTable = withTableAutoSizer(withSorting(FilterableTable));
    return (
      <SortableFilterableTable
        dataList={dataList}
        orderedColumnKeys={someColumns}
        height={400}
        columnFlexGrow={1}
        styles={sorableTableStyles}
      />
    );
  });
