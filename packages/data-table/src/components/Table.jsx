import React, { PropTypes } from 'react';
import { Column, SortDirection, Table } from 'react-virtualized';

import '../../node_modules/react-virtualized/styles.css';
import dataListPropType from '../propTypes/dataList';

function typeOrColumnKeyToType(PropType) {
  return PropTypes.oneOfType([
    PropType,
    PropTypes.objectOf(PropType),
  ]);
}

const propTypes = {
  // required
  dataList: dataListPropType.isRequired,
  height: PropTypes.number.isRequired,
  orderedColumnKeys: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  width: PropTypes.number.isRequired,

  // optional
  cellRendererByColumnKey: PropTypes.objectOf(PropTypes.func), // { [column]: func() => any }
  columnFlexGrow: typeOrColumnKeyToType(PropTypes.number),
  columnFlexShrink: typeOrColumnKeyToType(PropTypes.number),
  columnWidth: typeOrColumnKeyToType(PropTypes.number),
  deferredMeasurementCache: PropTypes.object,
  disableHeader: PropTypes.bool,
  disableSort: typeOrColumnKeyToType(PropTypes.bool),
  flexLastColumn: PropTypes.bool,
  headerHeight: PropTypes.number,
  headerRendererByColumnKey: PropTypes.objectOf(PropTypes.func),
  overscanRowCount: PropTypes.number,
  rowHeight: typeOrColumnKeyToType(PropTypes.number),
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
  cellRendererByColumnKey: undefined,
  columnFlexGrow: undefined,
  columnFlexShrink: 1,
  columnWidth: 50,
  deferredMeasurementCache: undefined,
  disableHeader: false,
  disableSort: undefined,
  flexLastColumn: true,
  headerHeight: 40,
  headerRendererByColumnKey: undefined,
  overscanRowCount: 10,
  rowHeight: 32,
  sort: undefined,
  sortBy: undefined,
  sortDirection: undefined,
};

function BasicTable({
  cellRendererByColumnKey,
  columnFlexGrow,
  columnFlexShrink,
  columnWidth,
  dataList,
  deferredMeasurementCache,
  disableHeader,
  disableSort,
  flexLastColumn,
  height,
  headerHeight,
  headerRendererByColumnKey,
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
      deferredMeasurementCache={deferredMeasurementCache}
      disableHeader={disableHeader}
      headerHeight={disableHeader ? undefined : headerHeight}
      height={height}
      overscanRowCount={overscanRowCount}
      rowHeight={(deferredMeasurementCache && deferredMeasurementCache.rowHeight) || rowHeight}
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
          flexGrow = typeof columnFlexGrow === 'object' ?
            columnFlexGrow[columnKey] : columnFlexGrow;
        } else {
          flexGrow = flexLastColumn && idx === orderedColumnKeys.length - 1 ? 1 : undefined;
        }
        return (
          <Column
            key={columnKey}
            cellRenderer={
              cellRendererByColumnKey &&
              cellRendererByColumnKey[columnKey]
            }
            dataKey={columnKey}
            disableSort={
              typeof disableSort === 'object' ?
              disableSort[columnKey] : disableSort}
            flexShrink={
              typeof columnFlexShrink === 'object' ?
              columnFlexShrink[columnKey] : columnFlexShrink
            }
            flexGrow={flexGrow}
            headerRendererByColumnKey={
              headerRendererByColumnKey &&
              headerRendererByColumnKey[columnKey]
            }
            label={columnKey}
            width={typeof columnWidth === 'object' ?
              columnWidth(columnKey) : columnWidth
            }
          />
        );
      })}
    </Table>
  );
}

BasicTable.propTypes = propTypes;
BasicTable.defaultProps = defaultProps;

export default BasicTable;
