import React from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ScatterplotLayer, PolygonLayer } from 'deck.gl';

import { SF as sfCoords } from './cityCoords';

const LIGHT_SETTINGS = {
  lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [1.0, 0.0, 0.0, 0.0],
  numberOfLights: 2,
};

const colors = {
  babuDark: [0, 166, 153],
  beach: [253, 192, 2],
  hackberry: [142, 24, 96],
  black: [255, 255, 255],
  white: [0, 0, 0],
};

const propTypes = {
  buildings: PropTypes.array,
  listings: PropTypes.array,
  neighborhoods: PropTypes.array,
  pois: PropTypes.array,
  reference: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  viewport: PropTypes.object,
};

const defaultProps = {
  buildings: null,
  listings: null,
  neighborhoods: null,
  pois: null,
  reference: null,
  viewport: {
    zoom: 12,
    bearing: 0,
    pitch: 0,
    ...sfCoords,
  },
};

class Overlay extends React.Component {
  render() {
    const { viewport, buildings, neighborhoods, pois, listings, reference } = this.props;

    const layers = [];
    if (buildings) {
      layers.push(
        new PolygonLayer({
          id: 'buildings',
          data: buildings,
          extruded: true,
          wireframe: false,
          fp64: true,
          getPolygon: f => f.polygon,
          getElevation: f => f.elevation,
          getFillColor: () => [74, 80, 87],
        }),
      );
    }
    if (neighborhoods && viewport.zoom < 16) {
      layers.push(
        new PolygonLayer({
          id: 'neighborhoods',
          data: neighborhoods,
          extruded: false,
          wireframe: false,
          stroked: true,
          fp64: false,
          opacity: 0.4,
          getWidth: () => 5,
          // getElevation: () => 7,
          getPolygon: f => f.polygon,
          getFillColor: () => [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
          getColor: () => colors.beach,
          lightSettings: LIGHT_SETTINGS,
        }),
      );
    }
    if (pois) {
      // layers.push(
      //   new ScatterplotLayer({
      //     id: 'pois',
      //     data: pois,
      //     radiusScale: 30,
      //     radiusMinPixels: 0.25,
      //     opacity: 0.8,
      //     getPosition: d => [Number(d.lng), Number(d.lat), 5],
      //     getColor: () => colors.babuDark,
      //     getRadius: () => 1,
      //     // updateTriggers: {
      //     //   getColor: {c1: maleColor, c2: femaleColor}
      //     // },
      //   }),
      // );
    }

    return layers.length === 0 ? null : (
      <DeckGL
        {...viewport}
        layers={layers}
      />
    );
  }
}

Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;

export default Overlay;
