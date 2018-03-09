import React from 'react';
import PropTypes from 'prop-types';
import { LinearGradient } from '@vx/gradient';

const gradients = [
  // {
  //   from: '#fff',
  //   fromOffset: '0%',
  //   to: '#7affd2',
  //   toOffset: '100%',
  // },
  {
    from: '#f45b69',
    fromOffset: '0%',
    to: '#6b2737',
    toOffset: '100%',
  },
  {
    to: '#f45b69',
    fromOffset: '0%',
    from: '#6b2737',
    toOffset: '100%',
  },
  {
    from: '#f45b69',
    fromOffset: '0%',
    to: '#6b2737',
    toOffset: '100%',
  },
  // {
  //   from: '#fff',
  //   fromOffset: '0%',
  //   to: '#76218a',
  //   toOffset: '100%',
  // },
];

class Backdrop extends React.PureComponent {
  render() {
    const { width, height } = this.props;

    return (
      <g>
        <LinearGradient id="backdrop" from="" to="" rotate={45}>
          <stop offset={gradients[0].fromOffset} stopColor={gradients[0].from} stopOpacity={1}>
            <animate
              attributeName="stop-color"
              values={gradients.map(grad => grad.from).join(';')}
              dur="15s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset={gradients[0].toOffset} stopColor={gradients[0].to} stopOpacity={1}>
            <animate
              attributeName="stop-color"
              values={gradients.map(grad => grad.to).join(';')}
              dur="15s"
              repeatCount="indefinite"
            />
          </stop>
        </LinearGradient>
        <rect x={0} y={0} width={width} height={height} fill="url(#backdrop)" />
      </g>
    );
  }
}

Backdrop.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

Backdrop.defaultProps = {};

export default Backdrop;
