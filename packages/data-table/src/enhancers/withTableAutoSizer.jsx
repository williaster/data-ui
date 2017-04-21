import React, { PropTypes } from 'react';
import { AutoSizer } from 'react-virtualized';

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  onResize: PropTypes.func,
};

const defaultProps = {
  width: null,
  height: null,
  onResize: undefined,
};

function withTableAutoSizer(WrappedComponent) {
  function WithAutoSizerComponent({
    width: overrideWidth,
    height: overrideHeight,
    onResize,
    ...props
  }) {
    return (
      <AutoSizer
        disableHeight={overrideHeight !== null}
        disableWidth={overrideWidth !== null}
        onResize={onResize}
      >
        {({ width, height }) => (
          <WrappedComponent
            width={overrideWidth !== null ? overrideWidth : width}
            height={overrideHeight !== null ? overrideHeight : height}
            {...props}
          />
        )}
      </AutoSizer>
    );
  }

  WithAutoSizerComponent.propTypes = propTypes;
  WithAutoSizerComponent.defaultProps = defaultProps;

  return WithAutoSizerComponent;
}

export default withTableAutoSizer;
