import { List } from 'immutable';
import React, { PropTypes, PureComponent } from 'react';
import {
  Column,
  Table,
  SortDirection,
  SortIndicator,
} from 'react-virtualized';

const propTypes = {
  orderedColumnKeys: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  filterText: PropTypes.string,
  headerHeight: PropTypes.number,
  overscanRowCount: PropTypes.number,
  rowHeight: PropTypes.number,
  striped: PropTypes.bool,
};

const defaultProps = {
  filterText: '',
  headerHeight: 32,
  overscanRowCount: 10,
  rowHeight: 32,
  striped: true,
};

export default class Table extends PureComponent {
  constructor(props) {
    super(props);
    this.list = List(this.formatTableData(props.data));
    this.headerRenderer = this.headerRenderer.bind(this);
    this.rowClassName = this.rowClassName.bind(this);
    this.sort = this.sort.bind(this);

    this.widthsForColumnsByKey = this.getWidthsForColumns();
    this.totalTableWidth = props.orderedColumnKeys
      .map(key => this.widthsForColumnsByKey[key])
      .reduce((curr, next) => curr + next);

    this.state = {
      sortBy: props.orderedColumnKeys[0],
      sortDirection: SortDirection.ASC,
      fitted: false,
    };
  }

  componentDidMount() {
    this.fitTableToWidthIfNeeded();
  }

  getDatum(list, index) {
    return list.get(index % list.size);
  }

  getTextWidth(text, fontDetails = '12px Roboto') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontDetails;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  getWidthsForColumns() {
    const PADDING = 40; // accounts for cell padding and width of sorting icon
    const widthsByColumnKey = {};
    this.props.orderedColumnKeys.forEach((key) => {
      const colWidths = this.list
        .map(d => getTextWidth(d[key]) + PADDING) // get width for each value for a key
        .push(getTextWidth(key) + PADDING); // add width of column key to end of list
      // set max width as value for key
      widthsByColumnKey[key] = Math.max(...colWidths);
    });
    return widthsByColumnKey;
  }

  fitTableToWidthIfNeeded() {
    const containerWidth = this.container.getBoundingClientRect().width;
    if (containerWidth > this.totalTableWidth) {
      this.totalTableWidth = containerWidth - 2; // accomodates 1px border on container
    }
    this.setState({ fitted: true });
  }

  formatTableData(data) {
    const formattedData = data.map((row) => {
      const newRow = {};
      for (const k in row) {
        const val = row[k];
        if (typeof (val) === 'string') {
          newRow[k] = val;
        } else {
          newRow[k] = JSON.stringify(val);
        }
      }
      return newRow;
    });
    return formattedData;
  }

  hasMatch(text, row) {
    const values = [];
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        values.push(row[key].toLowerCase());
      }
    }
    return values.some(v => v.includes(text.toLowerCase()));
  }

  headerRenderer({ dataKey, label, sortBy, sortDirection }) {
    return (
      <div>
        {label}
        {sortBy === dataKey &&
          <SortIndicator sortDirection={sortDirection} />
        }
      </div>
    );
  }

  rowClassName({ index }) {
    let className = '';
    if (this.props.striped) {
      className = index % 2 === 0 ? 'even-row' : 'odd-row';
    }
    return className;
  }

  sort({ sortBy, sortDirection }) {
    this.setState({ sortBy, sortDirection });
  }

  render() {
    const { sortBy, sortDirection } = this.state;
    const {
      filterText,
      headerHeight,
      height,
      orderedColumnKeys,
      overscanRowCount,
      rowHeight,
    } = this.props;

    let sortedAndFilteredList = this.list;
    // filter list
    if (filterText) {
      sortedAndFilteredList = this.list.filter(row => this.hasMatch(filterText, row));
    }
    // sort list
    sortedAndFilteredList = sortedAndFilteredList
      .sortBy(item => item[sortBy])
      .update(list => sortDirection === SortDirection.DESC ? list.reverse() : list);

    const rowGetter = ({ index }) => this.getDatum(sortedAndFilteredList, index);

    return (
      <div
        style={{ height }}
        className="filterable-table-container"
        ref={(ref) => { this.container = ref; }}
      >
        {this.state.fitted &&
          <Table
            ref="Table"
            headerHeight={headerHeight}
            height={height - 2}
            overscanRowCount={overscanRowCount}
            rowClassName={this.rowClassName}
            rowHeight={rowHeight}
            rowGetter={rowGetter}
            rowCount={sortedAndFilteredList.size}
            sort={this.sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            width={this.totalTableWidth}
          >
            {orderedColumnKeys.map(columnKey => (
              <Column
                dataKey={columnKey}
                disableSort={false}
                headerRenderer={this.headerRenderer}
                width={this.widthsForColumnsByKey[columnKey]}
                label={columnKey}
                key={columnKey}
              />
            ))}
          </Table>
        }
      </div>
    );
  }
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;
