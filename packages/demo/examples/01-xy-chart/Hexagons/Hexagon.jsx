import React from 'react';
import PropTypes from 'prop-types';

const SQRT3 = Math.sqrt(3);

const HEXAGON_POINTS = [
  [0, -1],
  [SQRT3 / 2, 0.5],
  [0, 1],
  [-SQRT3 / 2, 0.5],
  [-SQRT3 / 2, -0.5],
  [0, -1],
  [SQRT3 / 2, -0.5],
];

class Hexagon extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rotateY: 0,
    };
    this.initFlip = this.initFlip.bind(this);
  }

  // componentDidMount() {
  //   if (Math.random() > 0.85) {
  //     this.timeout = setTimeout(this.initFlip, Math.max(10000 * Math.random(), 1000));
  //   }
  // }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  initFlip() {
    this.setState(
      ({ rotateY }) => ({ rotateY: rotateY === 180 ? 0 : 180 }),
      // () => {
      //   if (Math.random() > 0.5) {
      //     this.timeout = setTimeout(this.initFlip, Math.max(10000 * Math.random(), 1000));
      //   }
      // },
    );
  }

  render() {
    const { index, fill, stroke, strokeWidth, radius } = this.props;

    const path = `m${HEXAGON_POINTS.map(p => [p[0] * radius, p[1] * radius].join(',')).join('l')}z`;

    return (
      <path
        onMouseOver={this.initFlip}
        d={path}
        fill={
          Math.random() > index
            ? (Math.random() < index && 'url(#pattern)') || 'transparent'
            : 'rgba(255,255,255,0.1)'
        }
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{
          transform: `rotateY(${this.state.rotateY}deg)`,
          transition: '1000ms ease all',
        }}
      />
    );
  }
}

Hexagon.propTypes = {
  radius: PropTypes.number.isRequired,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
};

Hexagon.defaultProps = {
  fill: '#7affd2',
  stroke: '#fff', // '#76218a',
  strokeWidth: 1,
};

export default Hexagon;
