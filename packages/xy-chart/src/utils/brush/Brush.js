import React from 'react';
import PropTypes from 'prop-types';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

import BrushHandle from './BrushHandle';
import BrushCorner from './BrushCorner';
import BrushSelection from './BrushSelection';
import { Drag } from '../drag';

export default class Brush extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      extent: {
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
      },
      bounds: {
        x0: 0,
        x1: props.width,
        y0: 0,
        y1: props.height,
      },
    };
    this.width = this.width.bind(this);
    this.height = this.height.bind(this);
    this.handles = this.handles.bind(this);
    this.corners = this.corners.bind(this);
    this.update = this.update.bind(this);
    this.reset = this.reset.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.getExtent = this.getExtent.bind(this);
  }

  getExtent(start, end) {
    const { brushDirection, width, height } = this.props;
    const x0 = brushDirection === 'vertical'
      ? 0
      : Math.min(start.x, end.x);
    const x1 = brushDirection === 'vertical'
      ? width
      : Math.max(start.x, end.x);
    const y0 = brushDirection === 'horizontal'
      ? 0
      : Math.min(start.y, end.y);
    const y1 = brushDirection === 'horizontal'
      ? height
      : Math.max(start.y, end.y);
    return {
      x0,
      x1,
      y0,
      y1,
    };
  }

  handleDragStart(draw) {
    const { onBrushStart, left, top } = this.props;
    if (onBrushStart) {
      onBrushStart();
    }
    this.update(prevBrush => ({
      ...prevBrush,
      start: {
        x: draw.x - left,
        y: draw.y - top,
      },
      end: {
        x: draw.x - left,
        y: draw.y - top,
      },
      extent: {
        x0: -1,
        x1: -1,
        y0: -1,
        y1: -1,
      },
      isBrushing: true,
    }));
  }

  handleDragMove(draw) {
    const { left, top } = this.props;
    if (!draw.isDragging) return;
    const end = {
      x: draw.x + draw.dx - left,
      y: draw.y + draw.dy - top,
    };
    this.update((prevBrush) => {
      const { start } = prevBrush;
      const extent = this.getExtent(start, end);
      return {
        ...prevBrush,
        end,
        extent,
      };
    });
  }

  handleDragEnd() {
    this.update(((prevBrush) => {
      const { extent } = prevBrush;
      return {
        ...prevBrush,
        start: {
          x: extent.x0,
          y: extent.y0,
        },
        end: {
          x: extent.x1,
          y: extent.y1,
        },
        isBrushing: false,
      };
    }));
  }

  width() {
    const { extent } = this.state;
    const { x0, x1 } = extent;
    return Math.max(Math.max(x0, x1) - Math.min(x0, x1), 0);
  }

  height() {
    const { extent } = this.state;
    const { y1, y0 } = extent;
    return Math.max(y1 - y0, 0);
  }

  handles() {
    const { handleSize } = this.props;
    const { extent } = this.state;
    const { x0, x1, y0, y1 } = extent;
    const offset = handleSize / 2;
    const width = this.width();
    const height = this.height();
    return {
      top: {
        x: x0 - offset,
        y: y0 - offset,
        height: handleSize,
        width: width + handleSize,
      },
      bottom: {
        x: x0 - offset,
        y: y1 - offset,
        height: handleSize,
        width: width + handleSize,
      },
      right: {
        x: x1 - offset,
        y: y0 - offset,
        height: height + handleSize,
        width: handleSize,
      },
      left: {
        x: x0 - offset,
        y: y0 - offset,
        height: height + handleSize,
        width: handleSize,
      },
    };
  }

  corners() {
    const { handleSize } = this.props;
    const { extent } = this.state;
    const { x0, x1, y0, y1 } = extent;
    const offset = handleSize / 2;
    return {
      topLeft: {
        x: Math.min(x0, x1) - offset,
        y: Math.min(y0, y1) - offset,
      },
      topRight: {
        x: Math.max(x0, x1) - offset,
        y: Math.min(y0, y1) - offset,
      },
      bottomLeft: {
        x: Math.min(x0, x1) - offset,
        y: Math.max(y0, y1) - offset,
      },
      bottomRight: {
        x: Math.max(x0, x1) - offset,
        y: Math.max(y0, y1) - offset,
      },
    };
  }

  update(updater) {
    this.setState(updater, () => {
      this.props.onChange(this.state);
    });
  }

  reset() {
    this.update(prevBrush => {
      return {
        start: undefined,
        end: undefined,
        extent: {
          x0: undefined,
          x1: undefined,
          y0: undefined,
          y1: undefined,
        },
        isBrushing: false,
        activeHandle: undefined,
      };
    });
  }

  render() {
    const {
      start,
      end,
    } = this.state;
    const {
      top,
      left,
      data,
      width: stageWidth,
      height: stageHeight,
      handleSize,
      onBrushStart,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
      resizeTriggerAreas,
      brushDirection,
    } = this.props;

    const handles = this.handles();
    const corners = this.corners();
    const width = this.width();
    const height = this.height();
    const resizeTriggerAreaSet = new Set(resizeTriggerAreas);

    return (
      <Group className="vx-brush" top={top} left={left}>
        {/* overlay */}
        <Drag
          width={stageWidth}
          height={stageHeight}
          resetOnStart
          onDragStart={this.handleDragStart}
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
        >
          {draw => {
            return (
              <Bar
                data={data}
                className="vx-brush-overlay"
                fill="transparent"
                x={0}
                y={0}
                width={stageWidth}
                height={stageHeight}
                onDoubleClick={data => event => this.reset(event)}
                onMouseDown={data => event => draw.dragStart(event)}
                onMouseLeave={data => event => {
                  if (onMouseLeave) onMouseLeave(event);
                }}
                onMouseMove={data => event => {
                  if (!draw.isDragging && onMouseMove)
                    this.props.onMouseMove(event);
                  if (draw.isDragging) draw.dragMove(event);
                }}
                onMouseUp={data => event => {
                  if (onMouseUp) onMouseUp(event);
                  draw.dragEnd(event);
                }}
                style={{ cursor: 'crosshair' }}
              />
            );
          }}
        </Drag>
        {/* selection */}
        {start &&
          end && (
            <BrushSelection
              updateBrush={this.update}
              width={width}
              height={height}
              stageWidth={stageWidth}
              stageHeight={stageHeight}
              brush={{ ...this.state }}
              fill="rgba(4, 154, 251, 1.000)"
              fillOpacity={0.1}
              stroke="rgba(4, 154, 251, 1.000)"
              strokeWidth={1}
              strokeOpacity={0.8}
            />
          )}
        {/* handles */}
        {start &&
          end &&
          Object.keys(handles).filter(handleKey => resizeTriggerAreaSet.has(handleKey)).map((handleKey, i) => {
            const handle = handles[handleKey];
            return (
              <BrushHandle
                key={`handle-${i}`}
                type={handleKey}
                handle={handle}
                stageWidth={stageWidth}
                stageHeight={stageHeight}
                updateBrush={this.update}
                brush={this.state}
              />
            );
          })}
        {/* corners */}
        {start &&
          end &&
          Object.keys(corners).filter(cornerKey => resizeTriggerAreaSet.has(cornerKey)).map((cornerKey, i) => {
            const corner = corners[cornerKey];
            return (
              <BrushCorner
                key={`corner-${i}`}
                type={cornerKey}
                brush={this.state}
                updateBrush={this.update}
                stageWidth={stageWidth}
                stageHeight={stageHeight}
                x={corner.x}
                y={corner.y}
                width={handleSize}
                height={handleSize}
                fill={'transparent'}
              />
            );
          })}
        )}
      </Group>
    );
  }
}

Brush.propTypes = {
  brushDirection: PropTypes.oneOf(['horizontal', 'vertical', 'both']),
};

Brush.defaultProps = {
  brushDirection: 'both',
};
