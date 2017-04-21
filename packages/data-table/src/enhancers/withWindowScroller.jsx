import React, { PropTypes } from 'react';
import { WindowScroller } from 'react-virtualized';

import { baseHOC, updateDisplayName } from './hocUtils';

const propTypes = {
  onResize: PropTypes.func,
  onScroll: PropTypes.func,
  scrollElement: PropTypes.any,
};

const defaultProps = {
  onResize: undefined,
  onScroll: undefined,
  scrollElement: undefined,
};

function withWindowScroller(WrappedComponent, pureComponent = true) {
  const BaseClass = baseHOC(pureComponent);

  class EnhancedComponent extends BaseClass {
    render() {
      const {
        onResize,
        onScroll,
        scrollElement,
        ...rest
      } = this.props;
      return (
        <WindowScroller
          onResize={onResize}
          onScroll={onScroll}
          scrollElement={scrollElement}
        >
          {({ height, isScrolling, scrollTop }) => (
            <WrappedComponent
              {...rest}
              autoHeight
              height={height}
              isScrolling={isScrolling}
              scrollTop={scrollTop}
            />
          )}
        </WindowScroller>
      );
    }
  }

  EnhancedComponent.propTypes = propTypes;
  EnhancedComponent.defaultProps = defaultProps;
  updateDisplayName(WrappedComponent, EnhancedComponent, 'withWindowScroller');

  return EnhancedComponent;
}

export default withWindowScroller;
