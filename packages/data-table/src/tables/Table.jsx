import { List } from 'immutable';
import React, { PropTypes } from 'react';
import {
  Column,
  Table,
  SortDirection,
} from 'react-virtualized';

import '../../node_modules/react-virtualized/styles.css';

const propTypes = {
  // required
  dataList: PropTypes.instanceOf(List).isRequired,
  height: PropTypes.number.isRequired,
  orderedColumnKeys: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  width: PropTypes.number.isRequired,

  // optional
  cellRenderer: PropTypes.func,
  columnFlexGrow: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  columnFlexShrink: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  columnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  disableHeader: PropTypes.bool,
  disableSort: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  flexLastColumn: PropTypes.bool,
  headerHeight: PropTypes.number,
  headerRenderer: PropTypes.func,
  overscanRowCount: PropTypes.number,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sort: PropTypes.func,
  sortBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
  // styles: PropTypes.shape({
  //   table: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  //   grid: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  //   row: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // }),
};

const defaultProps = {
  cellRenderer: undefined,
  columnFlexGrow: undefined,
  columnFlexShrink: undefined,
  columnWidth: 40,
  disableHeader: false,
  disableSort: undefined,
  flexLastColumn: true,
  headerHeight: 40,
  headerRenderer: undefined,
  overscanRowCount: 10,
  rowHeight: 32,
  sort: undefined,
  sortBy: undefined,
  sortDirection: undefined,
};

function BasicTable({
  cellRenderer,
  columnFlexGrow,
  columnFlexShrink,
  columnWidth,
  dataList,
  disableHeader,
  disableSort,
  flexLastColumn,
  height,
  headerHeight,
  headerRenderer,
  overscanRowCount,
  orderedColumnKeys,
  rowHeight,
  sort,
  sortBy,
  sortDirection,
  width,
}) {
  return (
    <Table
      disableHeader={disableHeader}
      headerHeight={disableHeader ? undefined : headerHeight}
      height={height}
      overscanRowCount={overscanRowCount}
      rowHeight={rowHeight}
      rowGetter={({ index }) => dataList.get(index % dataList.size)}
      rowCount={dataList.size}
      sort={sort}
      sortBy={sortBy}
      sortDirection={sortDirection}
      width={width}
    >
      {orderedColumnKeys.map((columnKey, idx) => {
        let flexGrow;
        if (typeof columnFlexGrow !== 'undefined') {
          flexGrow = typeof columnFlexGrow === 'function' ? columnFlexGrow(columnKey) : columnFlexGrow;
        } else {
          flexGrow = flexLastColumn && idx === orderedColumnKeys.length - 1 ? 1 : 0;
        }
        return (
          <Column
            key={columnKey}
            cellRenderer={cellRenderer}
            dataKey={columnKey}
            disableSort={typeof disableSort === 'function' ? disableSort(columnKey) : disableSort}
            flexShrink={typeof columnFlexShrink === 'function' ? columnFlexShrink(columnKey) : columnFlexShrink}
            flexGrow={flexGrow}
            headerRenderer={headerRenderer}
            label={columnKey}
            width={typeof columnWidth === 'function' ? columnWidth(columnKey) : columnWidth}
          />
        );
      })}
    </Table>
  );
}

BasicTable.propTypes = propTypes;
BasicTable.defaultProps = defaultProps;

export default BasicTable;
