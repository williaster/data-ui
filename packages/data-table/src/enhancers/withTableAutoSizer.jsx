import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer } from 'react-virtualized';

import { baseHOC, updateDisplayName } from './hocUtils';

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

function withTableAutoSizer(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    render() {
      const {
        width: overrideWidth,
        height: overrideHeight,
        onResize,
        ...rest
      } = this.props;
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
              {...rest}
            />
          )}
        </AutoSizer>
      );
    }
  }

  EnhancedComponent.propTypes = propTypes;
  EnhancedComponent.defaultProps = defaultProps;
  updateDisplayName(WrappedComponent, EnhancedComponent, 'withTableAutoSizer');

  return EnhancedComponent;
}

export default withTableAutoSizer;
