/* eslint react/prop-types: 0 */
import PropTypes from 'prop-types';
import React from 'react';

import { baseHOC, updateDisplayName } from './hocUtils';
import dataListPropType from '../propTypes/dataList';

const propTypes = {
  dataList: dataListPropType.isRequired,
  debounceMs: PropTypes.number,
  noDebounce: PropTypes.bool,
  filterRow: PropTypes.func,
  initialFilterText: PropTypes.string,
};

const defaultProps = {
  filterRow: (row, filterText) => {
    const re = new RegExp(filterText, 'gi');
    const values = Object.values(row).map(value => (value || '').toString().toLowerCase());

    return values.some(value => re.test(value));
  },
  initialFilterText: '',
  debounceMs: 75,
  noDebounce: false,
};

function withFiltering(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    constructor(props) {
      super(props);
      this.handleChangeFilterText = this.handleChangeFilterText.bind(this);
      this.state = {
        filterText: this.props.initialFilterText,
        filteredDataList: this.props.dataList,
        debounce: null,
      };
    }

    componentWillMount() {
      if (this.state.filterText) {
        this.handleChangeFilterText(this.state.filterText, this.props);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.dataList !== this.props.dataList) {
        this.handleChangeFilterText(this.state.filterText, nextProps);
      }
    }

    handleChangeFilterText(filterText, props) {
      const { noDebounce, debounceMs } = props || this.props;
      if (!window || noDebounce || !this.state.debounce) {
        const { dataList: originalData, filterRow } = props || this.props;
        const { filteredDataList, filterText: prevFilterText } = this.state;

        const newData = originalData !== this.props.dataList;

        const userDeletedLetter =
          prevFilterText &&
          filterText.length < prevFilterText.length &&
          prevFilterText.indexOf(filterText) >= -1;

        const nextState = {
          filterText,
          filteredDataList: newData || userDeletedLetter ? originalData : filteredDataList,
        };

        if (window) {
          nextState.debounce = window.setTimeout(() => {
            this.setState({ debounce: null });
          }, debounceMs);
        }

        if (filterText) {
          nextState.filteredDataList = nextState.filteredDataList.filter(row =>
            filterRow(row, filterText),
          );
        }

        this.setState(nextState);
      }

      this.setState({ filterText });
    }

    render() {
      const { filteredDataList, filterText } = this.state;
      const { dataList, ...rest } = this.props;

      return (
        <WrappedComponent
          {...rest}
          onChangeFilterText={this.handleChangeFilterText}
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
