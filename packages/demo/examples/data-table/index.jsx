import { List } from 'immutable';
import * as mockData from '@vx/mock-data';
import React from 'react';
import {
  Table,
  withDynamicCellHeights,
  withSorting,
  withTableAutoSizer,
  withWindowScroller,
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
    description: 'custom column labels',
    example: () => (
      <Table
        dataList={dataList}
        orderedColumnKeys={someColumns.slice(0, 2)}
        width={700}
        height={400}
        columnWidth={100}
        flexLastColumn
        styles={tableStyles}
        columnLabelByColumnKey={{
          [someColumns[0]]: 'Custom 1',
          [someColumns[1]]: 'Custom 2',
        }}
      />
    ),
  },
  {
    description: 'with window scrolling + auto width HOCs',
    example: () => {
      const WindowScrollingTable = withWindowScroller(withTableAutoSizer(Table));
      return ( // storybook container doesn't set an explicit size
        <WindowScrollingTable
          dataList={dataList}
          orderedColumnKeys={someColumns}
          columnFlexGrow={1}
          styles={tableStyles}
        />
      );
    },
  },
  {
    description: 'with auto width + height HOC',
    example: () => {
      const AutoSizedTable = withTableAutoSizer(Table);
      return ( // storybook container doesn't set an explicit size
        <div style={{ height: 500, background: '#FFB400' }}>
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
    description: 'with dynamic cell height HOC',
    example: () => {
      const DynamicCellHeight = withTableAutoSizer(withDynamicCellHeights(Table));
      return (
        <DynamicCellHeight
          dataList={dataList.map(d => ({
            ...d,
            'long column': Array(Math.random() > 0.5 ? 50 : 20).join('really long text '),
          }))}
          orderedColumnKeys={someColumns.slice(0, 2).concat(['long column'])}
          dynamicHeightColumnKeys={['long column']}
          height={600}
          columnWidth={150}
          flexLastColumn
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
    description: 'custom header cells, disabled sort, initial sort',
    example: () => {
      const SortableTable = withSorting(Table);
      return (
        <SortableTable
          dataList={dataList}
          orderedColumnKeys={someColumns}
          width={700}
          height={400}
          columnFlexGrow={1}
          styles={tableStyles}
          columnLabelByColumnKey={{
            [someColumns[0]]: `${someColumns[0]} (no sort)`,
          }}
          headerRenderer={({
            dataKey,
            disableSort,
            label,
            sortBy,
            sortDirection,
          }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                cursor: disableSort ? 'default' : 'pointer',
              }}
            >
              {label}
              {dataKey === sortBy && sortDirection === 'ASC' && '👍'}
              {dataKey === sortBy && sortDirection === 'DESC' && '👎'}
            </div>
          )}
          disableSort={{
            [someColumns[0]]: true,
          }}
          initialSortBy={someColumns[1]}
          initialSortDirection="ASC"
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
