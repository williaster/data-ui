import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  label: PropTypes.string,
  initialValue: PropTypes.number,
  onChange: PropTypes.func,
};

const defaultProps = {
  min: -3,
  max: 3,
  label: null,
  initialValue: 0,
  onChange: () => {},
};

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.initialValue };
    this.incrementValue = this.incrementValue.bind(this);
    this.decrementValue = this.decrementValue.bind(this);
  }

  incrementValue() {
    if (this.state.value < this.props.max) {
      const value = this.state.value + 1;
      this.setState({ value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  decrementValue() {
    if (this.state.value > this.props.min) {
      const value = this.state.value - 1;
      this.setState({ value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.label &&
          <span>{this.props.label} </span>}
        <span>{this.state.value}</span>
        <button onClick={this.incrementValue}>
          +
        </button>
        <button onClick={this.decrementValue}>
          -
        </button>
      </div>
    );
  }
}

Step.propTypes = propTypes;
Step.defaultProps = defaultProps;

export default Step;
