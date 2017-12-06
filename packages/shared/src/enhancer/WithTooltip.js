import React from 'react';
import PropTypes from 'prop-types';

import localPoint from '@vx/event/build/localPoint';
import withTooltip from '@vx/tooltip/build/enhancers/withTooltip';
import TooltipWithBounds, { withTooltipPropTypes as vxTooltipPropTypes } from '@vx/tooltip/build/tooltips/TooltipWithBounds';

export { default as Tooltip } from '@vx/tooltip/build/tooltips/Tooltip';

export const withTooltipPropTypes = {
  onMouseMove: PropTypes.func, // expects to be called like func({ event, datum })
  onMouseLeave: PropTypes.func, // expects to be called like func({ event, datum })
  tooltipData: PropTypes.any,
};

export const propTypes = {
  ...vxTooltipPropTypes,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  className: PropTypes.string,
  HoverStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderTooltip: PropTypes.func,
  styles: PropTypes.object,
  TooltipComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  tooltipProps: PropTypes.object,
};

const defaultProps = {
  className: null,
  HoverStyles: () => (
    <style type="text/css">{`
      .vx-arc:hover,
      .vx-bar:hover,
      .vx-glyph-dot:hover {
        opacity: 0.7;
      }
    `}</style>
  ),
  renderTooltip: null,
  styles: { display: 'inline-block', position: 'relative' },
  TooltipComponent: TooltipWithBounds,
  tooltipProps: null,
  tooltipTimeout: 200,
};

class WithTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.tooltipTimeout = null;
  }

  componentWillUnmount() {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
  }

  handleMouseMove({ event, datum, coords, ...rest }) {
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }

    let tooltipCoords = { x: 0, y: 0 };
    if (event && event.target && event.target.ownerSVGElement) {
      tooltipCoords = localPoint(event.target.ownerSVGElement, event);
    }

    tooltipCoords = { ...tooltipCoords, ...coords };

    this.props.showTooltip({
      tooltipLeft: tooltipCoords.x,
      tooltipTop: tooltipCoords.y,
      tooltipData: {
        event,
        datum,
        ...rest,
      },
    });
  }

  handleMouseLeave() {
    const { tooltipTimeout, hideTooltip } = this.props;
    this.tooltipTimeout = setTimeout(() => { hideTooltip(); }, tooltipTimeout);
  }

  render() {
    const {
      children,
      className,
      HoverStyles,
      tooltipData,
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
      tooltipProps,
      renderTooltip,
      styles,
      TooltipComponent,
    } = this.props;

    const childProps = {
      onMouseMove: this.handleMouseMove,
      onMouseLeave: this.handleMouseLeave,
      tooltipData,
    };

    const tooltipContent = renderTooltip
      && tooltipOpen
      && TooltipComponent
      && renderTooltip(tooltipData);

    return (
      <div style={styles} className={className}>

        {/* inject props or pass to a function depending on child */}
        {typeof children === 'function'
          ? children(childProps)
          : React.cloneElement(React.Children.only(children), childProps)}

        {Boolean(tooltipContent) &&
          <TooltipComponent
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            {...tooltipProps}
          >
            {tooltipContent}
          </TooltipComponent>}

        {HoverStyles && <HoverStyles />}
      </div>
    );
  }
}

WithTooltip.propTypes = propTypes;
WithTooltip.defaultProps = defaultProps;

export default withTooltip(WithTooltip);
