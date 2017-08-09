import React from 'react';
import PropTypes from 'prop-types';

import { localPoint } from '@vx/event';
import { withTooltip, TooltipWithBounds, withTooltipPropTypes } from '@vx/tooltip';

const propTypes = {
  ...withTooltipPropTypes,
  children: PropTypes.func.isRequired,
  HoverStyles: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  renderTooltip: PropTypes.func,
  TooltipComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

const defaultProps = {
  HoverStyles: () => (
    <style type="text/css">{`
      .vx-bar:hover,
      .vx-glyph-dot:hover {
        opacity: 0.7;
      }
    `}</style>
  ),
  renderTooltip: null,
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

  handleMouseMove({ event, data, datum, ...rest }) {
    if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
    const { x, y } = localPoint(event.target.ownerSVGElement, event);

    this.props.showTooltip({
      tooltipLeft: x + 10,
      tooltipTop: y + 10,
      tooltipData: {
        event,
        data,
        datum,
        ...rest,
      },
    });
  }

  handleMouseLeave() {
    const { tooltipTimeout, hideTooltip } = this.props;
    this.tooltipTimeout = setTimeout(() => hideTooltip(), tooltipTimeout);
  }

  render() {
    const {
      children,
      HoverStyles,
      tooltipData,
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
      renderTooltip,
      TooltipComponent,
    } = this.props;

    return (
      <div style={{ display: 'inline-block', position: 'relative' }}>

        {children({
          onMouseMove: this.handleMouseMove,
          onMouseLeave: this.handleMouseLeave,
          tooltipData,
        })}

        {tooltipOpen && TooltipComponent && renderTooltip &&
          <TooltipComponent
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            {renderTooltip(tooltipData)}
          </TooltipComponent>}

        {HoverStyles &&
          <HoverStyles />}
      </div>
    );
  }
}

WithTooltip.propTypes = propTypes;
WithTooltip.defaultProps = defaultProps;

export default withTooltip(WithTooltip);
