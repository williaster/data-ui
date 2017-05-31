import PropTypes from 'prop-types';
import React from 'react';

import {
  Table,
  withFiltering,
} from '@data-ui/data-table';

import LabeledInput from '../shared/LabeledInput';

const propTypes = {
  onChangeFilterText: PropTypes.func.isRequired,
  filterText: PropTypes.string,
};

const defaultProps = {
  filterText: '',
};

function FilterableTable({ onChangeFilterText, filterText, ...tableProps }) {
  return (
    <div>
      <LabeledInput
        name="FilterableTable"
        label=""
        placeholder="Filter rows"
        value={filterText}
        onChange={(event) => { onChangeFilterText(event.target.value); }}
      />
      <Table {...tableProps} />
    </div>
  );
}

FilterableTable.propTypes = propTypes;
FilterableTable.defaultProps = defaultProps;

export default withFiltering(FilterableTable);
