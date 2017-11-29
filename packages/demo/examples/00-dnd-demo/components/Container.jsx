/* eslint react/prop-types: 0 */
import React from 'react';

export default class Container extends React.PureComponent {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: this.props.direction === 'vertical' ? 'column' : 'row',
          flexWrap: 'wrap',
          flexGrow: 1,
          border: this.props.editMode ? '1px dashed #aaa' : null,
          minHeight: 64,
          background: '#fff',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
