/*
 * example usage:
 * const XYChartWithTheme = withTheme(theme)(XYChart);
 */
import React from 'react';
import { chartTheme as defaultTheme } from '@data-ui/theme';

import updateDisplayName from '../utils/updateDisplayName';

function withTheme(theme = defaultTheme) {
  return function withThemeHOC(WrappedComponent) {
    // use a class for ref-ability and for PureComponent optimization
    // eslint-disable-next-line react/prefer-stateless-function
    class EnhancedComponent extends React.PureComponent {
      render() {
        const { theme: componentTheme, ...restProps } = this.props;

        return <WrappedComponent {...restProps} theme={{ ...theme, ...componentTheme }} />;
      }
    }

    EnhancedComponent.propTypes = WrappedComponent.propTypes || {};
    EnhancedComponent.defaultProps = WrappedComponent.defaultProps || {};
    updateDisplayName(WrappedComponent, EnhancedComponent, 'withTheme');

    return EnhancedComponent;
  };
}

export default withTheme;
