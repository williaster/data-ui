/* eslint react/prop-types: 0 */
/* ^ there is a bug with how props are parsed with the enhanced component */
import React, { PropTypes } from 'react';
import { SortDirection } from 'react-virtualized';

import dataListPropType from '../propTypes/dataList';
import { baseHOC, updateDisplayName } from './hocUtils';

export const defaultComparator = (A, B) => {
  const numeric = A - B;
  if (!isNaN(numeric)) return numeric;
  if (!A && !B) return 0;
  if (!A) return -1;
  if (!B) return 1;
  if (A.toLowerCase && B.toLowerCase) {
    const a = A.toLowerCase();
    const b = B.toLowerCase();
    if (a > b) return 1;
    if (b > a) return -1;
  }
  return 0;
};

const propTypes = {
  dataList: dataListPropType.isRequired,
  sortComparator: PropTypes.func,
  initialSortBy: PropTypes.string,
  initialSortDirection: PropTypes.oneOf(Object.values(SortDirection)),
};

const defaultProps = {
  initialSortBy: null,
  initialSortDirection: null,
  sortComparator: defaultComparator,
};

function withSorting(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    static getSortedDataList({ dataList, sortBy, sortComparator, sortDirection }) {
      return dataList
        .sortBy(datum => datum[sortBy], sortComparator)
        .update(list => (sortDirection === SortDirection.DESC ? list.reverse() : list));
    }

    constructor(props) {
      super(props);
      this.onSort = this.onSort.bind(this);

      const {
        dataList,
        initialSortBy: sortBy,
        initialSortDirection: sortDirection,
        sortComparator,
      } = props;

      this.state = {
        sortBy,
        sortDirection,
        sortedDataList: sortBy && sortDirection ?
          EnhancedComponent.getSortedDataList({
            dataList,
            sortBy,
            sortDirection,
            sortComparator,
          }) : dataList,
      };
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.dataList !== this.props.dataList) {
        this.onSort(this.state, nextProps);
      }
    }

    onSort({ sortBy, sortDirection }, props) {
      const { dataList: originalData, sortComparator } = props || this.props;
      const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state;
      const nextState = { sortDirection, sortBy, sortedDataList: originalData };

      if (sortBy === prevSortBy && prevSortDirection === SortDirection.DESC) {
        nextState.sortBy = null;
        nextState.sortDirection = null;
      } else {
        nextState.sortedDataList = EnhancedComponent.getSortedDataList({
          dataList: originalData,
          sortBy,
          sortDirection,
          sortComparator,
        });
      }
      this.setState(nextState);
    }

    render() {
      const { sortedDataList, sortBy, sortDirection } = this.state;
      const { dataList, initialSortBy, initialSortDirection, ...rest } = this.props;
      return (
        <WrappedComponent
          {...rest}
          sort={this.onSort}
          sortBy={sortBy}
          sortDirection={sortDirection}
          dataList={sortedDataList}
        />
      );
    }
  }

  EnhancedComponent.propTypes = propTypes;
  EnhancedComponent.defaultProps = defaultProps;
  updateDisplayName(WrappedComponent, EnhancedComponent, 'withSorting');

  return EnhancedComponent;
}

export default withSorting;
