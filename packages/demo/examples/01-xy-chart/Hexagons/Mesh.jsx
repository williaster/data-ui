import React from 'react';
import PropTypes from 'prop-types';
import { PatternLines } from '@data-ui/xy-chart';
import Hexagon from './Hexagon';

class Mesh extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { width, height, radius, spacing } = this.props;

    const dx = radius * 2 * Math.sin(Math.PI / 3);
    const dy = radius * 1.5;
    const numRows = Math.ceil((height + radius) / dy) + 1;
    const numCols = Math.ceil(width / dx) + 1;

    const grid = [];
    for (let row = 0; row < numRows; row += 1) {
      for (let col = 0; col < numCols; col += 1) {
        grid.push([row, col]);
      }
    }

    console.log(grid);

    return (
      width > 50 && (
        <g>
          <PatternLines
            id="pattern"
            height={4}
            width={4}
            stroke={'#fff'}
            strokeWidth={1}
            orientation={['diagonal']}
          />
          {grid.map((d, i) => {
            const id = i;
            const [row, col] = d;
            const x = col * dx + (row % 2) * (dx / 2);
            const y = row * dy;

            return (
              <g key={id} transform={`translate(${x},${y})`}>
                <Hexagon
                  radius={radius - spacing}
                  fill={'#fff'}
                  strokeWidth={1}
                  stroke="transparent"
                  index={i / grid.length}
                />
              </g>
            );
          })}
        </g>
      )
    );
  }
}

Mesh.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  radius: PropTypes.number,
  spacing: PropTypes.number,
};

Mesh.defaultProps = {
  radius: 30,
  spacing: 0.5,
};

export default Mesh;
