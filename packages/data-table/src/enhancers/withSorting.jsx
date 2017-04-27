/* eslint react/prop-types: 0 */
/* ^ there is a bug with how props are parsed with the enhanced component */
import React, { PropTypes } from 'react';
import { SortDirection } from 'react-virtualized';

import dataListPropType from '../propTypes/dataList';
import { baseHOC, updateDisplayName } from './hocUtils';

const propTypes = {
  dataList: dataListPropType.isRequired,
  initialSortBy: PropTypes.string,
  initialSortDirection: PropTypes.oneOf(Object.values(SortDirection)),
};

const defaultProps = {
  initialSortBy: null,
  initialSortDirection: null,
};

function withSorting(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    constructor(props) {
      super(props);
      this.state = {
        sortBy: props.initialSortBy,
        sortDirection: props.initialSortDirection,
        sortedDataList: this.props.dataList,
      };
      this.onSort = this.onSort.bind(this);
    }

    componentWillReceiveProps(nextProps) {
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
