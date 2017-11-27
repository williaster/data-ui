import React from 'react';

export default class Chart extends React.PureComponent {
  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'skyblue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}
      >
        📈
      </div>
    );
  }
}
