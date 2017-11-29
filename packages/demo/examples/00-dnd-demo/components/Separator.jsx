import React from 'react';

export default class Separator extends React.PureComponent {
  render() {
    return (
      <div
        style={{
          height: 2,
          background: '#ccc',
          width: '100%',
          flexGrow: 1,
          flexShrink: 0,
        }}
      />
    );
  }
}
