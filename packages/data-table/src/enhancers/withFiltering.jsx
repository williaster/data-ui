import React, { PropTypes } from 'react';

import { baseHOC, updateDisplayName } from './hocUtils';
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

function withFiltering(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    constructor(props) {
      super(props);
      this.state = {
        filterText: this.props.initialFilterText,
        filteredDataList: this.props.dataList,
      };
      this.onChangeFilterText = this.onChangeFilterText.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      // eslint-disable-next-line react/prop-types
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

  EnhancedComponent.propTypes = propTypes;
  EnhancedComponent.defaultProps = defaultProps;
  updateDisplayName(WrappedComponent, EnhancedComponent, 'withFiltering');

  return EnhancedComponent;
}

export default withFiltering;
