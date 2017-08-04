import PropTypes from 'prop-types';
import React from 'react';
import throttle from 'lodash/throttle';

import { range } from 'd3-array';
import { randomNormal, randomLogNormal } from 'd3-random';

import { color as themeColors } from '@data-ui/theme';
import { Histogram, BarSeries, DensitySeries, XAxis, YAxis } from '@data-ui/histogram';

import Checkbox from '../shared/Checkbox';
import Spacer from '../shared/Spacer';
import Range from '../shared/Range';

const NUM_POINTS = 500;
const DEBOUNCE_MS = 100;

const distributionLookup = {
  normal: randomNormal,
  logNormal: randomLogNormal,
};

const colors = themeColors.categories;

function datumGenerator(generator) {
  return (_, i) => ({ value: generator(), id: i });
}

function getDataset({ n, mu, sigma, distribution, ...rest }) {
  const distributionGenerator = distributionLookup[distribution](mu, sigma);
  return {
    showBars: true,
    ...rest,
    n,
    mu,
    sigma,
    distribution,
    rawData: range(n).map(datumGenerator(distributionGenerator)),
  };
}

const valueAccessor = d => d.value;

const propTypes = {
  HistogramComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

const defaultProps = {
  HistogramComponent: Histogram,
};

class HistogramPlayground extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChangeBinCount = throttle(this.onChangeBinCount.bind(this), DEBOUNCE_MS);
    this.handleChangeDistribution = throttle(this.onChangeDistribution.bind(this), DEBOUNCE_MS);
    this.handleChangeMu = throttle(this.onChangeMu.bind(this), DEBOUNCE_MS);
    this.handleChangeSigma = throttle(this.onChangeSigma.bind(this), DEBOUNCE_MS);

    this.state = {
      datasets: [0, 1],
      0: getDataset({ n: NUM_POINTS, mu: 0, sigma: 1, distribution: 'normal', color: colors[0] }),
      1: getDataset({ n: NUM_POINTS, mu: 2, sigma: 1, distribution: 'normal', color: colors[1] }),

      cumulative: false,
      normalized: false,
      xAxis: true,
      yAxis: true,
      binCount: 50,
      horizontal: false,
    };
  }

  onChangeDistribution(datasetKey, nextDistribution) {
    const dataset = this.state[datasetKey];
    this.setState({
      [datasetKey]: getDataset({ ...dataset, distribution: nextDistribution }),
    });
  }

  onChangeMu(datasetKey, nextMu) {
    const dataset = this.state[datasetKey];
    this.setState({
      [datasetKey]: getDataset({ ...dataset, mu: Number(nextMu) }),
    });
  }

  onChangeSigma(datasetKey, nextSigma) {
    const dataset = this.state[datasetKey];
    this.setState({
      [datasetKey]: getDataset({ ...dataset, sigma: Number(nextSigma) }),
    });
  }

  onChangeBinCount(e) {
    if (e.target) this.setState({ binCount: Number(e.target.value) });
  }

  renderHistogramControls() {
    const { binCount } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: 8 }}>
        {['cumulative', 'normalized', 'xAxis', 'yAxis', 'horizontal'].map(key => (
          <Checkbox
            key={key}
            id={key}
            label={key}
            checked={Boolean(this.state[key])}
            onChange={() => { this.setState({ [key]: !this.state[key] }); }}
          />
        ))}
        <Range
          id="bins"
          label={`Approx #bins (${binCount})`}
          min={10}
          max={100}
          step={5}
          value={binCount}
          onChange={this.handleChangeBinCount}
        />
      </div>
    );
  }

  renderDatasetControls(datasetKey) {
    const dataset = this.state[datasetKey];
    const { distribution, mu, sigma, showBars, showDensity, color } = dataset;
    return (
      <div key={datasetKey} style={{ display: 'flex', flexDirection: 'row', paddingBottom: 8 }}>
        <Spacer>
          <span style={{ color }}>{`Dataset ${datasetKey}`}</span>
        </Spacer>
        <Spacer>
          <select
            name="distribution"
            onChange={(e) => {
              this.handleChangeDistribution(datasetKey, e.target.value);
            }}
            value={distribution}
          >
            <option value="normal">normal</option>
            <option value="logNormal">logNormal</option>
          </select>
        </Spacer>
        <Range
          id={`mu-${datasetKey}`}
          label={`Mu (${mu})`}
          min={-10}
          max={10}
          step={1}
          value={mu}
          onChange={(e) => { this.handleChangeMu(datasetKey, e.target.value); }}
        />
        <Range
          id={`sigma-${datasetKey}`}
          label={`Sigma (${sigma})`}
          min={1}
          max={15}
          step={1}
          value={sigma}
          onChange={(e) => { this.handleChangeSigma(datasetKey, e.target.value); }}
        />
        <Checkbox
          id={`show-density-${datasetKey}`}
          label="Show density"
          checked={Boolean(showDensity)}
          onChange={() => {
            this.setState({
              [datasetKey]: {
                ...this.state[datasetKey],
                showDensity: !showDensity,
                showBars: !showDensity ? true : this.state[datasetKey].showBars,
              },
            });
          }}
        />
        {showDensity &&
          <Checkbox
            id={`show-bars-${datasetKey}`}
            label="Show bars"
            checked={Boolean(showBars)}
            onChange={() => {
              this.setState({
                [datasetKey]: { ...this.state[datasetKey], showBars: !showBars },
              });
            }}
          />}
      </div>
    );
  }

  render() {
    const { HistogramComponent } = this.props;
    const { datasets, cumulative, normalized, xAxis, yAxis, binCount, horizontal } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {this.renderHistogramControls()}

        <HistogramComponent
          normalized={normalized}
          cumulative={cumulative}
          valueAccessor={valueAccessor}
          binCount={binCount}
          horizontal={horizontal}
        >
          {datasets.map(key => (
            !this.state[key].showDensity || this.state[key].showBars ? (
              <BarSeries
                key={key}
                fill={this.state[key].color}
                rawData={this.state[key].rawData}
              />
            ) : null
          ))}

          {datasets.map(key => (
            this.state[key].showDensity ? (
              <DensitySeries
                key={key}
                rawData={this.state[key].rawData}
                stroke={this.state[key].color}
                fill={this.state[key].color}
              />
            ) : null
          ))}

          {xAxis && <XAxis />}
          {yAxis && <YAxis />}
        </HistogramComponent>

        {datasets.map(key => this.renderDatasetControls(key))}
      </div>
    );
  }
}

HistogramPlayground.propTypes = propTypes;
HistogramPlayground.defaultProps = defaultProps;

export default HistogramPlayground;
