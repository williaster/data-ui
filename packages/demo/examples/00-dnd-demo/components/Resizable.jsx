import React from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';

const UNIT = 16;
const GRID = [UNIT, UNIT];
const MIN_WIDTH = 100;
const MIN_HEIGHT = null;
const MAX_WIDTH = 1440;
const MAX_HEIGHT = 500;

const propTypes = {
  enable: PropTypes.oneOfType([PropTypes.bool, PropTypes.objectOf(PropTypes.bool)]),
  children: PropTypes.node,
  defaultWidth: PropTypes.number,
  defaultHeight: PropTypes.number,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  grid: PropTypes.arrayOf(PropTypes.number),
};

export default class ResizableContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: props.defaultWidth,
      height: props.defaultHeight,
    };

    this.handleResizeStop = this.handleResizeStop.bind(this);
    this.handleResizeStart = this.handleResizeStart.bind(this);
  }

  handleResizeStart() {
    if (this.props.onResizeStart) this.props.onResizeStart();
  }

  handleResizeStop(event, direction, ref, delta) {
    this.setState(({ width, height }) => ({
      width: width + delta.width,
      height: height + delta.height,
    }));

    if (this.props.onResizeStop) this.props.onResizeStop();
  }

  render() {
    const { enable, children, grid, minWidth, maxWidth, minHeight, maxHeight } = this.props;
    return (
      <Resizable
        enable={enable}
        grid={grid}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        size={this.state}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
      >
        {children}
      </Resizable>
    );
  }
}

ResizableContainer.propTypes = propTypes;
ResizableContainer.defaultProps = {
  children: null,
  enable: {
    top: false,
    right: true,
    bottom: true,
    left: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  },
  defaultHeight: UNIT * 7,
  defaultWidth: UNIT * 7,
  minWidth: MIN_WIDTH,
  maxWidth: MAX_WIDTH,
  minHeight: MIN_HEIGHT,
  maxHeight: MAX_HEIGHT,
  grid: GRID,
};
