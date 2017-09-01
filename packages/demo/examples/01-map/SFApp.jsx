import MapGL from 'react-map-gl';
import PropTypes from 'prop-types';
import React from 'react';

import { withParentSize } from '@vx/responsive';
import { csv as requestCsv, json as requestJson } from 'd3-request';

import Overlay from './DeckGLOverlay';
import { MAPBOX_ACCESS_TOKEN } from './constants';

const propTypes = {
  parentWidth: PropTypes.number.isRequired,
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onViewportChange = this.onViewportChange.bind(this);
    this.state = {
      mapStyle: '',
      viewport: Overlay.defaultProps.viewport,
    };
  }

  componentDidMount() {
    // requestJson('/data/sf/buildings.json', (error, response) => {
    //   if (!error) {
    //     console.log('buildings', response);
    //     this.setState({
    //       buildings: response.features.map(feature => ({
    //         polygon: feature.geometry.coordinates[0],
    //         elevation: feature.properties.height || 0,
    //       })),
    //     });
    //   } else {
    //     throw Error(error);
    //   }
    // });

    requestCsv('/data/sf/guidebooks.csv', (error, response) => {
      if (!error) {
        console.log('pois', response);
        this.setState({
          pois: response,
        });
      } else {
        throw Error(error);
      }
    });

    requestJson('/data/sf/neighborhoods.json', (error, response) => {
      if (!error) {
        console.log('neighborhoods', response);
        this.setState({
          neighborhoods: response.features.map(feature => ({
            polygon: feature.geometry.coordinates[0][0],
          })),
        });
      } else {
        throw Error(error);
      }
    });
  }

  onViewportChange(viewport) {
    this.setState({ viewport });
  }

  render() {
    const { parentWidth } = this.props;
    const { viewport, buildings, neighborhoods, pois } = this.state;
    // console.log(viewport.latitude, viewport.longitude, viewport.zoom)

    return parentWidth < 100 ? null : (
      <MapGL
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        onViewportChange={this.onViewportChange}
        dragPan
        dragRotate
        scrollZoom
        touchZoomRotate
        doubleClickZoom
        minZoom={0}
        maxZoom={20}
        minPitch={0}
        maxPitch={50}
        {...viewport}
        width={parentWidth}
        height={parentWidth * 0.6}
      >
        <Overlay
          viewport={viewport}
          buildings={buildings}
          neighborhoods={neighborhoods}
          pois={pois}
        />
      </MapGL>
    );
  }
}

App.propTypes = propTypes;

export default withParentSize(App);
