import React from 'react';
import { Drag } from '../drag';

function handleResizeMove(drag, onBrushEnd) {
  const { dx } = drag;

  return prevBrush => {
    const { start, end, domain } = prevBrush;
    const nextState = {
      ...prevBrush,
      domain: {
        ...prevBrush.domain,
        x1: Math.max(start.x, end.x) + dx,
      },
    };
    if (onBrushEnd) onBrushEnd(nextState);

    return nextState;
  };
}

function handleResizeEnd(drag, onBrushEnd) {
  return prevBrush => {
    const { start, end, domain } = prevBrush;
    start.x = domain.x0;
    end.x = domain.x1;
    const nextState = {
      ...prevBrush,
      start,
      end,
      isBrushing: false,
      domain: {
        x0: Math.min(start.x, end.x),
        x1: Math.max(start.x, end.x),
        y0: Math.min(start.y, end.y),
        y1: Math.max(start.y, end.y),
      },
    };
    if (onBrushEnd) onBrushEnd(nextState);

    return nextState;
  };
}

export default class RightHandle extends React.Component {
  constructor(props) {
    super(props);
    this.dragMove = this.dragMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
  }

  dragMove(drag) {
    const { updateBrush, onBrushEnd } = this.props;
    updateBrush(handleResizeMove(drag, onBrushEnd));
  }

  dragEnd(drag) {
    const { updateBrush, onBrushEnd, brush } = this.props;
    updateBrush(handleResizeEnd(drag, onBrushEnd));
  }

  render() {
    const { width, height, top, left, brush } = this.props;

    return (
      <Drag
        width={width}
        height={height}
        resetOnStart
        onDragMove={this.dragMove}
        onDragEnd={this.dragEnd}
      >
        {right => (
          <rect
            width={6}
            height={height}
            x={brush.domain.x1 - left - 3}
            y={0}
            fill="transparent"
            style={{
              cursor: brush.isBrushing ? undefined : 'ew-resize',
            }}
            onMouseUp={event => {
              if (brush.isBrushing) {
                return this.dragEnd(event);
              }
              right.dragEnd(event);
            }}
            onMouseDown={event => {
              if (brush.isBrushing) return;
              right.dragStart(event);
            }}
            onMouseMove={event => {
              if (brush.isBrushing) {
                return this.dragMove(event);
              }
              if (right.isDragging) right.dragMove(event);
            }}
          />
        )}
      </Drag>
    );
  }
}
