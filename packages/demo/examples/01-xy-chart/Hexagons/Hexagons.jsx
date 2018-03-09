// useful ref https://www.redblobgames.com/grids/hexagons/
import React from 'react';
import { withScreenSize } from '@data-ui/xy-chart';

import Backdrop from './Backdrop';
import Mesh from './Mesh';

class Hexagons extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { screenWidth: width, screenHeight: height } = this.props;

    return (
      <svg width={width} height={height}>
        <Backdrop key="backdrop" width={width} height={height} />,
        <Mesh key="mesh" width={width} height={height} />,
      </svg>
    );
  }
}

export default withScreenSize(Hexagons);
