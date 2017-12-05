import React from 'react';
import PropTypes from 'prop-types';
import { allColors } from '@data-ui/theme/build/color';
import { Button } from '@data-ui/forms';

import {
  CrossHair,
  XAxis,
  YAxis,
  LineSeries,
  WithTooltip,
} from '@data-ui/xy-chart';

import ResponsiveXYChart, { formatYear } from './ResponsiveXYChart';
import { timeSeriesData } from './data';
import WithToggle from '../shared/WithToggle';

const seriesProps = [
  {
    label: 'Stock 1',
    key: 'Stock 1',
    data: timeSeriesData,
    stroke: allColors.grape[9],
    showPoints: true,
    dashType: 'solid',
  },
  {
    label: 'Stock 2',
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
    label: 'Stock 3',
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

const TOOLTIP_TIMEOUT = 350;
const CONTAINER_TRIGGER = 'CONTAINER_TRIGGER';
const VORONOI_TRIGGER = 'VORONOI_TRIGGER';

class LineSeriesExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      programmaticTrigger: false,
      trigger: CONTAINER_TRIGGER,
    };
    this.ref = this.ref.bind(this);
    this.triggerTooltip = this.triggerTooltip.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);
    this.restartProgrammaticTooltip = this.restartProgrammaticTooltip.bind(this);
    this.setTrigger = this.setTrigger.bind(this);
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  setTrigger(nextTrigger) {
    this.setState(() => ({ trigger: nextTrigger }));
  }

  ref(ref) {
    this.chart = ref;
    this.triggerTooltip();
  }

  triggerTooltip() {
    if (this.chart && this.state.index < seriesProps[0].data.length) {
      if (this.timeout) clearTimeout(this.timeout);

      this.setState(({ index, trigger }) => {
        this.chart.handleMouseMove({
          datum: seriesProps[2].data[index],
          series: trigger === VORONOI_TRIGGER ? null : {
            [seriesProps[0].label]: seriesProps[0].data[index],
            [seriesProps[1].label]: seriesProps[1].data[index],
            [seriesProps[2].label]: seriesProps[2].data[index],
          },
          overrideCoords: trigger === VORONOI_TRIGGER ? null : {
            y: 50,
          },
        });

        this.timeout = setTimeout(this.triggerTooltip, TOOLTIP_TIMEOUT);

        return { index: index + 1, programmaticTrigger: true };
      });
    } else if (this.chart) {
      this.chart.handleMouseLeave();
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
    if (this.chart) {
      this.setState(() => ({ index: 0 }), this.triggerTooltip);
    }
  }

  renderControls(disableMouseEvents) {
    const { trigger } = this.state;
    const useVoronoiTrigger = trigger === VORONOI_TRIGGER;
    return (
      <div style={{ display: 'flex' }}>
        <Button
          small
          rounded
          active={!disableMouseEvents && !useVoronoiTrigger}
          disabled={disableMouseEvents}
          onClick={() => { this.setTrigger(CONTAINER_TRIGGER); }}
        > Shared Tooltip
        </Button>
        <div style={{ width: 8 }} />
        <Button
          small
          rounded
          active={!disableMouseEvents && useVoronoiTrigger}
          disabled={disableMouseEvents}
          onClick={() => { this.setTrigger(VORONOI_TRIGGER); }}
        > Voronoi Tooltip
        </Button>
        <div style={{ width: 16 }} />
        <Button
          small
          rounded
          disabled={disableMouseEvents}
          onClick={() => { this.restartProgrammaticTooltip(); }}
        > Programatically trigger tooltip
        </Button>
      </div>
    );
  }

  renderTooltip({ datum, series }) {
    const { programmaticTrigger, trigger } = this.state;
    return (
      <div>
        <div>
          {formatYear(datum.x)}
          {(!series || Object.keys(series).length === 0) &&
            <div>
              {datum.y.toFixed(2)}
            </div>}
        </div>
        {trigger === CONTAINER_TRIGGER && <br />}
        {seriesProps.map(({ label, stroke: color, dashType }) => (
          series && series[label] &&
            <div key={label}>
              <span
                style={{
                  color,
                  textDecoration: !programmaticTrigger && series[label] === datum
                    ? `underline ${dashType} ${color}` : null,
                  fontWeight: series[label] === datum ? 600 : 200,
                }}
              >
                {`${label} `}
              </span>
              {series[label].y.toFixed(2)}
            </div>
        ))}
      </div>
    );
  }

  render() {
    const { trigger } = this.state;
    const useVoronoiTrigger = trigger === VORONOI_TRIGGER;
    return (
      <WithToggle id="line_mouse_events_toggle" label="Disable mouse events">
        {disableMouseEvents => (
          <div>
            {this.renderControls(disableMouseEvents)}
            <WithTooltip
              snapToDataY={useVoronoiTrigger}
              renderTooltip={this.renderTooltip}
            >
              <ResponsiveXYChart
                ariaLabel="Required label"
                xScale={{ type: 'time' }}
                yScale={{ type: 'linear' }}
                useVoronoi={useVoronoiTrigger}
                showVoronoi={useVoronoiTrigger}
                margin={{ left: 8, top: 16 }}
                renderTooltip={null}
                innerRef={this.ref}
              >
                <XAxis label="Time" numTicks={5} />
                <YAxis label="Stock price ($)" numTicks={4} />
                {seriesProps.map(props => (
                  <LineSeries
                    {...props}
                    disableMouseEvents={disableMouseEvents}
                  />
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
            </WithTooltip>
          </div>
        )}
      </WithToggle>
    );
  }
}

export default LineSeriesExample;
