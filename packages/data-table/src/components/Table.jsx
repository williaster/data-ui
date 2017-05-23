import React, { PropTypes } from 'react';
import { Column, SortDirection, Table } from 'react-virtualized';

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
  classNames: PropTypes.shape({
    table: PropTypes.string,
    grid: PropTypes.string,
    header: PropTypes.string,
    row: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func, // ({ index }) => string
    ]),
  }),
  columnFlexGrow: typeOrColumnKeyToType(PropTypes.number),
  columnFlexShrink: typeOrColumnKeyToType(PropTypes.number),
  columnLabelByColumnKey: PropTypes.objectOf(PropTypes.string),
  columnWidth: typeOrColumnKeyToType(PropTypes.number),
  deferredMeasurementCache: PropTypes.object,
  disableHeader: PropTypes.bool,
  disableSort: typeOrColumnKeyToType(PropTypes.bool),
  flexLastColumn: PropTypes.bool,
  headerHeight: PropTypes.number,
  headerRenderer: typeOrColumnKeyToType(PropTypes.func),
  overscanRowCount: PropTypes.number,
  rowHeight: typeOrColumnKeyToType(
    PropTypes.oneOfType([PropTypes.func, PropTypes.number]), // ({ index }) => number
  ),
  rowRenderer: PropTypes.func,
  sort: PropTypes.func,
  sortBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
  styles: PropTypes.shape({
    table: PropTypes.object,
    grid: PropTypes.object,
    header: PropTypes.object,
    row: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func, // ({ index }) => object
    ]),
  }),
  tableRef: PropTypes.func, // passed to <Table ref={...} />
};

const defaultProps = {
  cellRendererByColumnKey: undefined,
  classNames: {},
  columnFlexGrow: undefined,
  columnFlexShrink: 1,
  columnLabelByColumnKey: undefined,
  columnWidth: 50,
  deferredMeasurementCache: undefined,
  disableHeader: false,
  disableSort: undefined,
  flexLastColumn: true,
  headerHeight: 42,
  headerRenderer: undefined,
  overscanRowCount: 10,
  rowHeight: 38,
  rowRenderer: undefined,
  sort: undefined,
  sortBy: undefined,
  sortDirection: undefined,
  styles: {},
  tableRef: null,
};

// eslint-disable-next-line react/prefer-stateless-function
class BasicTable extends React.PureComponent {
  render() {
    const {
      cellRendererByColumnKey,
      classNames: {
        table: className,
        header: headerClassName,
        row: rowClassName,
      },
      columnFlexGrow,
      columnFlexShrink,
      columnLabelByColumnKey,
      columnWidth,
      dataList,
      deferredMeasurementCache,
      disableHeader,
      disableSort,
      flexLastColumn,
      height,
      headerHeight,
      headerRenderer,
      overscanRowCount,
      orderedColumnKeys,
      rowHeight,
      rowRenderer,
      sort,
      sortBy,
      sortDirection,
      styles: {
        table: style,
        header: headerStyle,
        row: rowStyle,
      },
      tableRef,
      width,
    } = this.props;
    return (
      <Table
        deferredMeasurementCache={deferredMeasurementCache}
        disableHeader={disableHeader}
        headerHeight={disableHeader ? undefined : headerHeight}
        height={height}
        overscanRowCount={overscanRowCount}
        ref={tableRef}
        rowHeight={(deferredMeasurementCache && deferredMeasurementCache.rowHeight) || rowHeight}
        rowGetter={({ index }) => dataList.get(index % dataList.size)}
        rowCount={dataList.size}
        sort={sort}
        sortBy={sortBy}
        sortDirection={sortDirection}
        width={width}
        className={className}
        headerClassName={headerClassName}
        rowClassName={rowClassName}
        style={style}
        headerStyle={headerStyle}
        rowRenderer={rowRenderer}
        rowStyle={rowStyle}
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
              headerRenderer={
                typeof headerRenderer === 'object' ?
                headerRenderer[columnKey] : headerRenderer
              }
              label={
                (columnLabelByColumnKey &&
                 typeof columnLabelByColumnKey[columnKey] !== 'undefined') ?
                columnLabelByColumnKey[columnKey] : columnKey
              }
              width={typeof columnWidth === 'object' ?
                columnWidth[columnKey] : columnWidth
              }

            />
          );
        })}
      </Table>
    );
  }
}

BasicTable.propTypes = propTypes;
BasicTable.defaultProps = defaultProps;

export default BasicTable;
