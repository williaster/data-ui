import React, { Component, PropTypes } from 'react';

import dataListPropType from '../propTypes/dataList';

const propTypes = {
  dataList: dataListPropType.isRequired,
  filterRow: PropTypes.func,
  initialFilterText: PropTypes.string,
};

const defaultProps = {
  filterRow: (row, filterText) => {
    const re = new RegExp(filterText, 'gi');
    const values = Object.values(row).map(value => value.toString().toLowerCase());
    return values.some(value => re.test(value));
  },
  initialFilterText: '',
};

function withFiltering(WrappedComponent) {
  class WithFilteringComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        filterText: this.props.initialFilterText,
        filteredDataList: this.props.dataList,
      };
      this.onChangeFilterText = this.onChangeFilterText.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.dataList !== this.props.dataList) {
        this.onChangeFilterText(this.state.filterText, nextProps);
      }
    }

    onChangeFilterText(filterText, props) {
      console.log('filtering', filterText);
      const { dataList: originalData, filterRow } = props || this.props;
      const nextState = { filterText, filteredDataList: originalData };
      if (filterText) {
        nextState.filteredDataList = originalData.filter(row => filterRow(row, filterText));
      }
      this.setState(nextState);
    }

    render() {
      const { filteredDataList, filterText } = this.state;
      const { dataList, ...rest } = this.props;
      return (
        <WrappedComponent
          {...rest}
          onChangeFilterText={this.onChangeFilterText}
          dataList={filteredDataList}
          filterText={filterText}
        />
      );
    }
  }

  WithFilteringComponent.propTypes = propTypes;
  WithFilteringComponent.defaultProps = defaultProps;

  return WithFilteringComponent;
}

export default withFiltering;

// const withFiltering = compose(
//   withState(
//     'filterState',
//     'updateFilterState',
//     ({ dataList, initialFilterText = '', filterRow = defaultFilterRow }) => ({
//       originalData: dataList,
//       dataList: initialFilterText ?
//         dataList.filter(row => filterRow(row, initialFilterText)) :
//         dataList,
//       filterRow,
//     }),
//   ),

//   withHandlers({
//     onChangeFilterText: ({ updateFilterState }) => (filterText) => {
//       updateFilterState(({ originalData, filterRow }) => {
//         const nextState = { filterRow, originalData, filterText, dataList: originalData };
//         if (filterText) {
//           nextState.dataList = originalData.filter(row => filterRow(row, filterText));
//         }
//         return nextState;
//       });
//     },
//   }),

//   mapProps(({ filterState, ...rest }) => ({
//     ...rest,
//     filterText: filterState.filterText,
//     dataList: filterState.dataList,
//   })),
// );

// export default withFiltering;
