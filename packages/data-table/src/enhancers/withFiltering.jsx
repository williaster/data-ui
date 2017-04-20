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
