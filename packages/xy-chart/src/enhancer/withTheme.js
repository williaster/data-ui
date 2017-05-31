/*
 * example usage:
 * const XYChartWithTheme = withTheme(theme)(XYChart);
 */
import React from 'react';
import updateDisplayName from '../utils/updateDisplayName';
import defaultTheme from '../theme';

function withTheme(theme = defaultTheme) {
  return function withThemeHOC(WrappedComponent) {
    // use a class for ref-ability and for PureComponent optimization
    // eslint-disable-next-line react/prefer-stateless-function
    class EnhancedComponent extends React.PureComponent {
      render() {
        return (
          <WrappedComponent theme={theme} {...this.props} />
        );
      }
    }

    EnhancedComponent.propTypes = WrappedComponent.propTypes || {};
    EnhancedComponent.defaultProps = WrappedComponent.defaultProps || {};
    if (EnhancedComponent.propTypes.theme) delete EnhancedComponent.propTypes.theme;
    if (EnhancedComponent.defaultProps.theme) delete EnhancedComponent.defaultProps.theme;
    updateDisplayName(WrappedComponent, EnhancedComponent, 'withTheme');

    return EnhancedComponent;
  };
}

export default withTheme;
