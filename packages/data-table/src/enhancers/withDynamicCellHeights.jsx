import PropTypes from 'prop-types';
import React from 'react';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import { baseHOC, updateDisplayName } from './hocUtils';

// eslint-disable-next-line react/prop-types
const defaultCellRenderer = ({ cellData /* , dataKey, parent, rowData, rowIndex */ }) => (
  <div
    style={{
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    }}
  >
    {cellData}
  </div>
);

const propTypes = {
  // wrapped by CellMeasurer and returns the cell contents, one or one for each column
  cellRendererByColumnKey: PropTypes.objectOf(PropTypes.func),
  defaultCellHeight: PropTypes.number,
  dynamicHeightColumnKeys: PropTypes.arrayOf(PropTypes.string).isRequired, // dynamic height is computed for these
  minCellHeight: PropTypes.number,
};

const defaultProps = {
  // eslint-disable-next-line react/prop-types
  cellRendererByColumnKey: null,
  defaultCellHeight: 32,
  minCellHeight: 32,
};

function withDynamicCellHeights(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    static getDynamicHeightCellCache({ defaultCellHeight, minCellHeight }) {
      return new CellMeasurerCache({
        defaultHeight: defaultCellHeight,
        fixedHeight: false,
        fixedWidth: true,
        minHeight: minCellHeight,
      });
    }

    constructor(props) {
      super(props);
      this.cellRenderer = this.cellRenderer.bind(this);
      this.state = {
        cache: EnhancedComponent.getDynamicHeightCellCache(props),
      };
    }

    cellRenderer({ cellData, dataKey, parent, rowData, rowIndex }) {
      const { cellRendererByColumnKey } = this.props;
      const cellRenderer =
        (cellRendererByColumnKey && cellRendererByColumnKey[dataKey]) || defaultCellRenderer;

      return (
        <CellMeasurer
          cache={this.state.cache}
          columnIndex={0}
          key={dataKey}
          parent={parent}
          rowIndex={rowIndex}
        >
          {cellRenderer({ cellData, dataKey, parent, rowData, rowIndex })}
        </CellMeasurer>
      );
    }

    render() {
      const {
        cellRendererByColumnKey,
        dynamicHeightColumnKeys,
        defaultCellHeight,
        minCellHeight,
        ...rest
      } = this.props;
      const dynamicCellRenderers = Object.assign(
        ...dynamicHeightColumnKeys.map(key => ({
          [key]: this.cellRenderer,
        })),
      );

      return (
        <WrappedComponent
          {...rest}
          deferredMeasurementCache={this.state.cache}
          cellRendererByColumnKey={{
            ...cellRendererByColumnKey,
            ...dynamicCellRenderers,
          }}
        />
      );
    }
  }

  EnhancedComponent.propTypes = propTypes;
  EnhancedComponent.defaultProps = defaultProps;
  updateDisplayName(WrappedComponent, EnhancedComponent, 'withDynamicCellHeights');

  return EnhancedComponent;
}

export default withDynamicCellHeights;
