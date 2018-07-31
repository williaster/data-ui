import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

const defaultProps = {
  children: null,
  onFocus: null,
  onBlur: null,
};

// This component wraps its children in an <a /> tag which is the most reliable way to
// support tabIndex focusing accross browsers for SVG < v2.0
export default class FocusBlurHandler extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    // eslint-disable-line class-methods-use-this
    e.preventDefault();
  }

  render() {
    const { children, onFocus, onBlur } = this.props;

    return (
      <a // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/anchor-is-valid
        xlinkHref={(onBlur || onFocus) && '#'}
        role="presentation"
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={this.handleOnClick}
      >
        {children}
      </a>
    );
  }
}

FocusBlurHandler.propTypes = propTypes;
FocusBlurHandler.defaultProps = defaultProps;
FocusBlurHandler.displayName = 'FocusBlurHandler';
