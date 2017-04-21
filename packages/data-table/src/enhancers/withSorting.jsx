import React from 'react';
import { SortDirection } from 'react-virtualized';

import dataListPropType from '../propTypes/dataList';
import { baseHOC, updateDisplayName } from './hocUtils';

const propTypes = {
  dataList: dataListPropType.isRequired,
};

function withSorting(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    constructor(props) {
      super(props);
      this.state = {
        sortBy: null,
        sortDirection: null,
        sortedDataList: this.props.dataList,
      };
      this.onSort = this.onSort.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      // eslint-disable-next-line react/prop-types
      if (nextProps.dataList !== this.props.dataList) {
        this.onSort(this.state, nextProps);
      }
    }

    onSort({ sortBy, sortDirection }, props) {
      const { dataList: originalData } = props || this.props;
      const { sortBy: prevSortBy, sortDirection: prevSortDirection } = this.state;
      const nextState = { sortDirection, sortBy, sortedDataList: originalData };

      if (sortBy === prevSortBy && prevSortDirection === SortDirection.DESC) {
        nextState.sortBy = null;
        nextState.sortDirection = null;
      } else {
        nextState.sortedDataList = originalData
          .sortBy(datum => datum[sortBy])
          .update(list => (sortDirection === SortDirection.DESC ? list.reverse() : list));
      }
      this.setState(nextState);
    }

    render() {
      const { sortedDataList, sortBy, sortDirection } = this.state;
      const { dataList, ...rest } = this.props;
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
  updateDisplayName(WrappedComponent, EnhancedComponent, 'withSorting');

  return EnhancedComponent;
}

export default withSorting;
