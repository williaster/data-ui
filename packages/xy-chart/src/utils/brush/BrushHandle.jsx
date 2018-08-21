import React from 'react';
import PropTypes from 'prop-types';
import { Drag } from '../drag';

export default class BrushHandle extends React.Component {
  constructor(props) {
    super(props);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleDragMove(drag) {
    const { updateBrush, type } = this.props;
    if (!drag.isDragging) return;
    updateBrush(prevBrush => {
      const { start, end } = prevBrush;
      let nextState = {};
      let move = 0;
      const xMax = Math.max(start.x, end.x);
      const xMin = Math.min(start.x, end.x);
      const yMax = Math.max(start.y, end.y);
      const yMin = Math.min(start.y, end.y);
      switch (type) {
        case 'right':
          move = xMax + drag.dx;
          nextState = {
            ...prevBrush,
            activeHandle: type,
            extent: {
              ...prevBrush.extent,
              x0: Math.max(Math.min(move, start.x), prevBrush.bounds.x0),
              x1: Math.min(Math.max(move, start.x), prevBrush.bounds.x1),
            },
          };
          break;
        case 'left':
          move = xMin + drag.dx;
          nextState = {
            ...prevBrush,
            activeHandle: type,
            extent: {
              ...prevBrush.extent,
              x0: Math.min(move, end.x),
              x1: Math.max(move, end.x),
            },
          };
          break;
        case 'bottom':
          move = yMax + drag.dy;
          nextState = {
            ...prevBrush,
            activeHandle: type,
            extent: {
              ...prevBrush.extent,
              y0: Math.min(move, start.y),
              y1: Math.max(move, start.y),
            },
          };
          break;
        case 'top':
          move = yMin + drag.dy;
          nextState = {
            ...prevBrush,
            activeHandle: type,
            extent: {
              ...prevBrush.extent,
              y0: Math.min(move, end.y),
              y1: Math.max(move, end.y),
            },
          };
          break;
        default:
          break;
      }

      return nextState;
    });
  }

  handleDragEnd(drag) {
    const { type, handle, updateBrush } = this.props;
    updateBrush(prevBrush => {
      const { start, end, extent } = prevBrush;
      start.x = Math.min(extent.x0, extent.x1);
      start.y = Math.min(extent.y0, extent.y0);
      end.x = Math.max(extent.x0, extent.x1);
      end.y = Math.max(extent.y0, extent.y1);
      const nextState = {
        ...prevBrush,
        start,
        end,
        activeHandle: undefined,
        isBrushing: false,
        domain: {
          x0: Math.min(start.x, end.x),
          x1: Math.max(start.x, end.x),
          y0: Math.min(start.y, end.y),
          y1: Math.max(start.y, end.y),
        },
      };

      return nextState;
    });
  }

  render() {
    const { stageWidth, stageHeight, brush, type } = this.props;
    const { x, y, width, height } = this.props.handle;
    const cursor = type === 'right' || type === 'left' ? 'ew-resize' : 'ns-resize';

    return (
      <Drag
        width={stageWidth}
        height={stageHeight}
        onDragMove={this.handleDragMove}
        onDragEnd={this.handleDragEnd}
        resetOnStart
      >
        {handle => (
          <g>
            {handle.isDragging && (
              <rect
                fill="transparent"
                width={stageWidth}
                height={stageHeight}
                style={{ cursor }}
                onMouseMove={handle.dragMove}
                onMouseUp={handle.dragEnd}
                onMouseLeave={handle.dragEnd}
              />
            )}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill="transparent"
              className="test-test"
              onMouseDown={handle.dragStart}
              onMouseMove={handle.dragMove}
              onMouseUp={handle.dragEnd}
              style={{
                cursor,
                pointerEvents: !!brush.activeHandle || !!brush.isBrushing ? 'none' : 'all',
              }}
            />
          </g>
        )}
      </Drag>
    );
  }
}
