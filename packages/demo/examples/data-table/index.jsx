import { List } from 'immutable';
import mockData from '@vx/mock-data';
import React from 'react';
import {
  Table,
  withDynamicCellHeights,
  withSorting,
  withTableAutoSizer,
} from '@data-ui/data-table';

import { tableStyles, sorableTableStyles } from './tableStyles';
import FilterableTable from './FilterableTable';

const dataList = List(mockData.browserUsage);
const allColumns = Object.keys(mockData.browserUsage[0]);
const someColumns = allColumns.slice(0, 4);

export default [
  {
    description: 'default no frills',
    example: () => (
      <Table
        dataList={dataList}
        orderedColumnKeys={someColumns}
        width={700}
        height={400}
        columnWidth={600}
        styles={tableStyles}
      />
    ),
  },
  {
    description: 'flex last column',
    example: () => (
      <Table
        dataList={dataList}
        orderedColumnKeys={someColumns.slice(0, 2)}
        width={700}
        height={400}
        columnWidth={100}
        flexLastColumn
        styles={tableStyles}
      />
    ),
  },
  {
    description: 'with auto width + height HOC',
    example: () => {
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
    },
  },
  {
    description: 'with auto width HOC',
    example: () => {
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
    },
  },
  {
    description: 'dynamic cell heights',
    example: () => {
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
    },
  },
  {
    description: 'with sortable HOC',
    example: () => {
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
    },
  },
  {
    description: 'with filterable HOC',
    example: () => (
      <FilterableTable
        dataList={dataList}
        orderedColumnKeys={someColumns}
        width={700}
        height={400}
        columnFlexGrow={1}
        styles={tableStyles}
      />
    ),
  },
  {
    description: 'with auto width, sorting, and filtering HOCs',
    example: () => {
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
    },
  },
  {
    description: 'with horizontal scroll',
    example: () => (
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
    ),
  },
];
