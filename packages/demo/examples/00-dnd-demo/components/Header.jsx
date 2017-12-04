/* eslint react/prop-types: 0 */
import React from 'react';

export default class Header extends React.PureComponent {
  render() {
    return (
      <div style={{ flexBasis: '100%', flexGrow: 1, flexShrink: 0, fontSize: 18, fontWeight: 600 }}>
        {this.props.text || 'My header'}
      </div>
    );
  }
}
