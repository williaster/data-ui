import React, { PropTypes } from 'react';
import {
  defaultTableRowRenderer,
  Table,
  withDynamicCellHeights,
} from '@data-ui/data-table';

const EnhancedTable = Table; //withDynamicCellHeights(Table);

const propTypes = {
  cellRendererByColumnKey: PropTypes.objectOf(PropTypes.func),
  columnLabelByColumnKey: PropTypes.objectOf(PropTypes.string),
  dataList: PropTypes.object.isRequired,
  expandedRowHeight: PropTypes.number,
  // expandedRowRenderer: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  orderedColumnKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  styles: PropTypes.object,
  width: PropTypes.number.isRequired,
};

const defaultProps = {
  cellRendererByColumnKey: {},
  columnLabelByColumnKey: {},
  styles: {},
  expandedRowHeight: 200,
};

class ExpandableRowTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: {},
    };
    this.onClickExpand = this.onClickExpand.bind(this);
    this.expandableCellRenderer = this.expandableCellRenderer.bind(this);
    this.rowHeight = this.rowHeight.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  onClickExpand(index) {
    this.setState({
      expandedRows: {
        ...this.state.expandedRows,
        [index]: !this.state.expandedRows[index],
      },
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.expandedRows !== prevState.expandedRows) {
      this.tableRef.recomputeRowHeights(); // @TODO: get index
      this.tableRef.forceUpdate();
    }
  }

  expandableCellRenderer({ rowIndex }) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          this.onClickExpand(rowIndex);
        }}
        style={{ cursor: 'pointer' }}
      >
        {this.state.expandedRows[rowIndex] ? 'v' : '>'}
      </div>
    );
  }

  rowRenderer(params) {
    if (this.state.expandedRows[params.index]) {
      const { key, style, rowData } = params;

      const DefaultRow = defaultTableRowRenderer({
        ...params,

        style: {
          ...style,
          top: 0,
          height: 42, //style.height - this.props.expandedRowHeight,
        },
      });

      return (
        <div
          key={key}
          style={{ ...style, flexDirection: 'column', height: 242 }}
        >
          {DefaultRow}
          <div
            style={{
              ...style,
              top: style.height - this.props.expandedRowHeight,
              height: this.props.expandedRowHeight,
            }}
          >
            {JSON.stringify(rowData)}
          </div>
        </div>
      );
    }
    return defaultTableRowRenderer(params);
  }

  rowHeight({ index }) {
    if (this.state.expandedRows[index]) {
      return this.props.expandedRowHeight + 42;
    }
    return 42;
  }

  render() {
    const {
      cellRendererByColumnKey,
      columnLabelByColumnKey,
      dataList,
      height,
      orderedColumnKeys,
      styles,
      width,
    } = this.props;

    return (
      <EnhancedTable
        cellRendererByColumnKey={{
          ...cellRendererByColumnKey,
          expandHandle: this.expandableCellRenderer,
        }}
        columnLabelByColumnKey={{
          ...columnLabelByColumnKey,
          expandHandle: '',
        }}
        dataList={dataList}
        dynamicHeightColumnKeys={['expandHandle']}
        orderedColumnKeys={['expandHandle'].concat(orderedColumnKeys)}
        rowHeight={this.rowHeight}
        rowRenderer={this.rowRenderer}
        tableRef={(ref) => { this.tableRef = ref; }}
        width={width}
        height={height}
        styles={styles}
        columnFlexGrow={1}
      />
    );
  }
}

ExpandableRowTable.propTypes = propTypes;
ExpandableRowTable.defaultProps = defaultProps;

export default ExpandableRowTable;
