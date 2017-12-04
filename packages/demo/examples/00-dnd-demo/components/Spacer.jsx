/* eslint react/prop-types: 0 */
import React from 'react';

export default class Spacer extends React.PureComponent {
  render() {
    return (
      <div
        style={{
          background: 'inherit',
          minWidth: 16,
          minHeight: 16,
          width: '100%',
          height: '100%',
          flexGrow: 1,
          flexShrink: 0,
          border: this.props.editMode ? '1px dashed #aaa' : null,
          ...this.props.styles,
        }}
      />
    );
  }
}
