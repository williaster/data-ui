/* eslint react/prop-types: 0 */
import React from 'react';

export default class Header extends React.PureComponent {
  render() {
    return (
      <div style={{ width: '100%', flexGrow: 1, flexShrink: 0 }}>
        <h4>{this.props.text || 'My header'}</h4>
      </div>
    );
  }
}
