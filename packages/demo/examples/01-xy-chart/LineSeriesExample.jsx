import React from 'react';
import { allColors } from '@data-ui/theme';
import { Button } from '@data-ui/forms';

import { CrossHair, LineSeries, WithTooltip, XAxis, YAxis, Brush } from '@data-ui/xy-chart';

import ResponsiveXYChart, { formatYear } from './ResponsiveXYChart';
import { timeSeriesData } from './data';
import WithToggle from '../shared/WithToggle';

const seriesProps = [
  {
    seriesKey: 'Stock 1',
    key: 'Stock 1',
    data: timeSeriesData,
    stroke: allColors.grape[9],
    showPoints: true,
    dashType: 'solid',
  },
  {
    seriesKey: 'Stock 2',
    key: 'Stock 2',
    data: timeSeriesData.map(d => ({
      ...d,
      y: Math.random() > 0.5 ? d.y * 2 : d.y / 2,
    })),
    stroke: allColors.grape[7],
    strokeDasharray: '6 4',
    dashType: 'dashed',
    strokeLinecap: 'butt',
  },
  {
    seriesKey: 'Stock 3',
    key: 'Stock 3',
    data: timeSeriesData.map(d => ({
      ...d,
      y: Math.random() < 0.3 ? d.y * 3 : d.y / 3,
    })),
    stroke: allColors.grape[4],
    strokeDasharray: '2 2',
    dashType: 'dotted',
    strokeLinecap: 'butt',
  },
];

const MARGIN = { left: 8, top: 16 };
const TOOLTIP_TIMEOUT = 250;
const CONTAINER_TRIGGER = 'CONTAINER_TRIGGER';
const VORONOI_TRIGGER = 'VORONOI_TRIGGER';

class LineSeriesExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      programmaticTrigger: false,
      trigger: CONTAINER_TRIGGER,
      stickyTooltip: false,
    };
    this.eventTriggerRefs = this.eventTriggerRefs.bind(this);
    this.triggerTooltip = this.triggerTooltip.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);
    this.restartProgrammaticTooltip = this.restartProgrammaticTooltip.bind(this);
    this.setTrigger = this.setTrigger.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  setTrigger(nextTrigger) {
    this.setState(() => ({ trigger: nextTrigger }));
  }

  handleClick(args) {
    if (this.triggers) {
      this.setState(
        ({ stickyTooltip }) => ({
          stickyTooltip: !stickyTooltip,
        }),
        () => {
          this.triggers.mousemove(args);
        },
      );
    }
  }

  eventTriggerRefs(triggers) {
    this.triggers = triggers;
  }

  triggerTooltip() {
    if (this.triggers && this.state.index < seriesProps[0].data.length) {
      if (this.timeout) clearTimeout(this.timeout);
      this.setState(({ index, trigger }) => {
        this.triggers.mousemove({
          datum: seriesProps[2].data[index],
          series:
            trigger === VORONOI_TRIGGER
              ? null
              : {
                  [seriesProps[0].seriesKey]: seriesProps[0].data[index],
                  [seriesProps[1].seriesKey]: seriesProps[1].data[index],
                  [seriesProps[2].seriesKey]: seriesProps[2].data[index],
                },
          coords:
            trigger === VORONOI_TRIGGER
              ? null
              : {
                  y: 50,
                },
        });

        this.timeout = setTimeout(this.triggerTooltip, TOOLTIP_TIMEOUT);

        return { index: index + 1, programmaticTrigger: true };
      });
    } else if (this.triggers) {
      this.triggers.mouseleave();
      this.timeout = setTimeout(() => {
        this.setState(() => ({
          index: 0,
          programmaticTrigger: false,
        }));
      }, TOOLTIP_TIMEOUT);
    }
  }

  restartProgrammaticTooltip() {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.triggers) {
      this.setState(() => ({ stickyTooltip: false, index: 0 }), this.triggerTooltip);
    }
  }

  renderControls(disableMouseEvents) {
    const { trigger, stickyTooltip } = this.state;
    const useVoronoiTrigger = trigger === VORONOI_TRIGGER;

    return [
      <div key="buttons" style={{ display: 'flex' }}>
        <Button
          small
          rounded
          active={!disableMouseEvents && !useVoronoiTrigger}
          disabled={disableMouseEvents}
          onClick={() => {
            this.setTrigger(CONTAINER_TRIGGER);
          }}
        >
          {' '}
          Shared Tooltip
        </Button>
        <div style={{ width: 8 }} />
        <Button
          small
          rounded
          active={!disableMouseEvents && useVoronoiTrigger}
          disabled={disableMouseEvents}
          onClick={() => {
            this.setTrigger(VORONOI_TRIGGER);
          }}
        >
          {' '}
          Voronoi Tooltip
        </Button>
        <div style={{ width: 16 }} />
        <Button
          small
          rounded
          disabled={disableMouseEvents}
          onClick={() => {
            this.restartProgrammaticTooltip();
          }}
        >
          {' '}
          Programatically trigger tooltip
        </Button>
      </div>,
      <div key="sticky" style={{ margin: '8px 0', fontSize: 14 }}>
        Click chart for a&nbsp;
        <span
          style={{
            fontWeight: stickyTooltip && 600,
            textDecoration: stickyTooltip && `underline ${allColors.grape[4]}`,
          }}
        >
          sticky tooltip
        </span>
      </div>,
    ];
  }

  renderTooltip({ datum, series }) {
    const { programmaticTrigger, trigger } = this.state;

    return (
      <div>
        <div>
          <strong>{formatYear(datum.x)}</strong>
          {(!series || Object.keys(series).length === 0) && <div>${datum.y.toFixed(2)}</div>}
        </div>
        {trigger === CONTAINER_TRIGGER && <br />}
        {seriesProps.map(
          ({ seriesKey, stroke: color, dashType }) =>
            series &&
            series[seriesKey] && (
              <div key={seriesKey}>
                <span
                  style={{
                    color,
                    textDecoration:
                      !programmaticTrigger && series[seriesKey] === datum
                        ? `underline ${dashType} ${color}`
                        : null,
                    fontWeight: series[seriesKey] === datum ? 600 : 200,
                  }}
                >
                  {`${seriesKey} `}
                </span>
                ${series[seriesKey].y.toFixed(2)}
              </div>
            ),
        )}
      </div>
    );
  }

  render() {
    const { trigger, stickyTooltip } = this.state;
    const useVoronoiTrigger = trigger === VORONOI_TRIGGER;

    return (
      <WithToggle id="line_mouse_events_toggle" label="Disable mouse events">
        {disableMouseEvents => (
          <div>
            {this.renderControls(disableMouseEvents)}

            {/* Use WithTooltip to intercept mouse events in stickyTooltip state */}
            <WithTooltip renderTooltip={this.renderTooltip}>
              {({ onMouseLeave, onMouseMove, tooltipData }) => (
                <ResponsiveXYChart
                  ariaLabel="Required label"
                  eventTrigger={useVoronoiTrigger ? 'voronoi' : 'container'}
                  eventTriggerRefs={this.eventTriggerRefs}
                  margin={MARGIN}
                  onClick={disableMouseEvents ? null : this.handleClick}
                  onMouseMove={disableMouseEvents || stickyTooltip ? null : onMouseMove}
                  onMouseLeave={disableMouseEvents || stickyTooltip ? null : onMouseLeave}
                  renderTooltip={null}
                  showVoronoi={useVoronoiTrigger}
                  snapTooltipToDataX
                  snapTooltipToDataY={useVoronoiTrigger}
                  tooltipData={tooltipData}
                  xScale={{ type: 'time' }}
                  yScale={{ type: 'linear' }}
                >
                  <XAxis label="Time" numTicks={5} />
                  <YAxis label="Stock price ($)" numTicks={4} />
                  {seriesProps.map(({ key, ...props }) => (
                    <LineSeries key={key} {...props} disableMouseEvents={disableMouseEvents} />
                  ))}
                  <CrossHair
                    fullHeight
                    showHorizontalLine={false}
                    strokeDasharray=""
                    stroke={allColors.grape[4]}
                    circleStroke={allColors.grape[4]}
                    circleFill="#fff"
                    showCircle={useVoronoiTrigger || !this.state.programmaticTrigger}
                  />
                </ResponsiveXYChart>
              )}
            </WithTooltip>
          </div>
        )}
      </WithToggle>
    );
  }
}

export default LineSeriesExample;
