import React, { PropTypes, PureComponent } from 'react';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';

const propTypes = {
  // wrapped by CellMeasurer and returns the cell contents, one or one for each column
  cellRenderer: PropTypes.oneOf([
    PropTypes.func,
    PropTypes.objectOf(PropTypes.func),
  ]),
  defaultCellHeight: PropTypes.number,
  dynamicHeightColumnKeys: PropTypes.array.isRequired, // dynamic height is computed for these
  minCellHeight: PropTypes.number,
};

const defaultProps = {
  // eslint-disable-next-line react/prop-types
  cellRenderer: ({ cellData /* , dataKey, parent, rowData, rowIndex */ }) => (
    <div
      style={{
        whiteSpace: 'normal',
        background: '#eaeaea',
        wordBreak: 'break-word',
      }}
    >
      {Array(10).join(cellData)}
    </div>
  ),
  defaultCellHeight: 32,
  minCellHeight: 32,
};

function withDynamicCellHeights(WrappedComponent) {
  class EnhancedComponent extends PureComponent {
    static getDynamicHeightCellCache({
      defaultCellHeight,
      minCellHeight,
    }) {
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
      const { cellRenderer } = this.props;
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
        cellRenderer,
        dynamicHeightColumnKeys,
        defaultCellHeight,
        minCellHeight,
        ...rest
      } = this.props;
      return (
        <WrappedComponent
          {...rest}
          deferredMeasurementCache={this.state.cache}
          cellRendererByColumnKey={Object.assign(
            ...dynamicHeightColumnKeys.map(key => ({
              [key]: this.cellRenderer,
            }),
          ))}
        />
      );
    }
  }

  EnhancedComponent.propTypes = propTypes;
  EnhancedComponent.defaultProps = defaultProps;

  return EnhancedComponent;
}

export default withDynamicCellHeights;
