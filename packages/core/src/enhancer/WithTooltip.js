import React from 'react';
import PropTypes from 'prop-types';

import localPoint from '@vx/event/build/localPoint';
import withTooltip from '@vx/tooltip/build/enhancers/withTooltip';
import TooltipWithBounds, { withTooltipPropTypes as vxTooltipPropTypes } from '@vx/tooltip/build/tooltips/TooltipWithBounds';

export const withTooltipPropTypes = {
  onMouseMove: PropTypes.func, // expects to be called like func({ event, datum })
  onMouseLeave: PropTypes.func, // expects to be called like func({ event, datum })
  tooltipData: PropTypes.any,
};

const propTypes = {
  ...vxTooltipPropTypes,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  className: PropTypes.string,
  HoverStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderTooltip: PropTypes.func,
  styles: PropTypes.object,
  TooltipComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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
  tooltipTimeout: 200,
};

class WithTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.tooltipTimeout = null;
  }

  handleMouseMove({ event, datum, ...rest }) {
    if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);

    let coords = { x: 0, y: 0 };
    if (event && event.target && event.target.ownerSVGElement) {
      coords = localPoint(event.target.ownerSVGElement, event);
    }

    this.props.showTooltip({
      tooltipLeft: coords.x + 10,
      tooltipTop: coords.y + 10,
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
      renderTooltip,
      styles,
      TooltipComponent,
    } = this.props;

    const childProps = {
      onMouseMove: this.handleMouseMove,
      onMouseLeave: this.handleMouseLeave,
      tooltipData,
    };

    return (
      <div style={styles} className={className}>

        {/* inject props or pass to a function depending on child */}
        {typeof children === 'function'
          ? children(childProps)
          : React.cloneElement(React.Children.only(children), childProps)}

        {tooltipOpen && TooltipComponent && renderTooltip &&
          <TooltipComponent
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            {renderTooltip(tooltipData)}
          </TooltipComponent>}

        {HoverStyles && <HoverStyles />}
      </div>
    );
  }
}

WithTooltip.propTypes = propTypes;
WithTooltip.defaultProps = defaultProps;

export default withTooltip(WithTooltip);
