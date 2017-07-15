import { List } from 'immutable';
import mockData from '@vx/mock-data';
import React from 'react';
import {
  Table,
  withDynamicCellHeights,
  withSorting,
  withTableAutoSizer,
  withWindowScroller,
} from '@data-ui/data-table';

import readme from '../../node_modules/@data-ui/data-table/README.md';

import { tableStyles, sorableTableStyles } from './tableStyles';
import FilterableTable from './FilterableTable';

const WindowScrollingTable = withWindowScroller(withTableAutoSizer(Table));
const AutoSizedTable = withTableAutoSizer(Table);
const DynamicCellHeight = withTableAutoSizer(withDynamicCellHeights(Table));
const SortableTable = withSorting(Table);
const SortableFilterableTable = withTableAutoSizer(withSorting(FilterableTable));

const dataList = List(mockData.browserUsage);
const allColumns = Object.keys(mockData.browserUsage[0]);
const someColumns = allColumns.slice(0, 4);

export default {
  usage: readme,
  examples: [
    {
      description: 'default no frills',
      components: [Table],
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
      components: [Table],
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
      components: [Table],
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
      components: [WindowScrollingTable],
      useHOC: true,
      example: () => ( // storybook container doesn't set an explicit size
        <WindowScrollingTable
          dataList={dataList}
          orderedColumnKeys={someColumns}
          columnFlexGrow={1}
          styles={tableStyles}
        />
      ),
    },
    {
      description: 'with auto width + height HOC',
      components: [AutoSizedTable],
      useHOC: true,
      example: () => ( // storybook container doesn't set an explicit size
        <div style={{ height: 500, background: '#FFB400' }}>
          <AutoSizedTable
            dataList={dataList}
            orderedColumnKeys={someColumns}
            columnFlexGrow={1}
            styles={tableStyles}
          />
        </div>
      ),
    },
    {
      description: 'with auto width HOC',
      components: [AutoSizedTable],
      useHOC: true,
      example: () => (
        <AutoSizedTable
          dataList={dataList}
          orderedColumnKeys={someColumns}
          height={300}
          disableHeight
          columnFlexGrow={1}
          styles={tableStyles}
        />
      ),
    },
    {
      description: 'with dynamic cell height HOC',
      components: [DynamicCellHeight],
      useHOC: true,
      example: () => (
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
      ),
    },
    {
      description: 'with sortable HOC',
      components: [SortableTable],
      useHOC: true,
      example: () => (
        <SortableTable
          dataList={dataList}
          orderedColumnKeys={someColumns}
          width={700}
          height={400}
          columnFlexGrow={1}
          styles={sorableTableStyles}
        />
      ),
    },
    {
      description: 'custom header cells, disabled sort, initial sort',
      components: [SortableTable],
      useHOC: true,
      example: () => (
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
      ),
    },
    {
      description: 'with filterable HOC',
      components: [FilterableTable],
      useHOC: true,
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
      components: [SortableFilterableTable],
      useHOC: true,
      example: () => (
        <SortableFilterableTable
          dataList={dataList}
          orderedColumnKeys={someColumns}
          height={400}
          columnFlexGrow={1}
          styles={sorableTableStyles}
        />
      ),
    },
    {
      description: 'with horizontal scroll',
      components: [Table],
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
  ],
};
