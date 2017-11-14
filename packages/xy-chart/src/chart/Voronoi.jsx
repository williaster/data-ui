/* eslint react/no-array-index-key: 0, react/no-unused-prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import Group from '@vx/group/build/Group';
import voronoiLayout from '@vx/voronoi/build/voronoi';
import VoronoiPolygon from '@vx/voronoi/build/components/VoronoiPolygon';

const propTypes = {
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  showVoronoi: PropTypes.bool,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
};

const defaultProps = {
  onClick: null,
  onMouseMove: null,
  onMouseLeave: null,
  showVoronoi: false,
};

class Voronoi extends React.PureComponent {
  static getVoronoi(props) {
    const { x, y, data, width, height } = props;
    return voronoiLayout({ x, y, width, height })(data);
  }

  constructor(props) {
    super(props);
    this.state = { voronoi: Voronoi.getVoronoi(props) };
  }

  componentWillReceiveProps(nextProps) {
    if (['data', 'x', 'y', 'width', 'height'].some(prop => (
      this.props[prop] !== nextProps[prop]
    ))) {
      this.setState({ voronoi: Voronoi.getVoronoi(nextProps) });
    }
  }

  render() {
    const { onMouseLeave, onMouseMove, onClick, showVoronoi } = this.props;
    const { voronoi } = this.state;
    return (
      <Group>
        {voronoi.polygons().map((polygon, i) => (
          <VoronoiPolygon
            key={`voronoi-${polygon.length}-${i}`}
            polygon={polygon}
            fill="transparent"
            stroke={showVoronoi ? '#ddd' : 'transparent'}
            strokeWidth={1}
            onClick={onClick && (() => (event) => {
              onClick({ event, datum: polygon.data });
            })}
            onMouseMove={onMouseMove && (() => (event) => {
              onMouseMove({ event, datum: polygon.data });
            })}
            onMouseLeave={onMouseLeave && (() => onMouseLeave)}
          />
        ))}
      </Group>
    );
  }
}

Voronoi.propTypes = propTypes;
Voronoi.defaultProps = defaultProps;
Voronoi.displayName = 'Voronoi';

export default Voronoi;
