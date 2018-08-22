import React from 'react';
import { shallow } from 'enzyme';
import { theme as defaultTheme, withTheme } from '../../src';

describe('withTheme', () => {
  it('should be a fn', () => {
    expect(withTheme).toBeInstanceOf(Function);
  });

  it('should return a fn', () => {
    expect(withTheme()).toBeInstanceOf(Function);
  });
});

describe('HOC', () => {
  it('has a wrapped displayName', () => {
    function MyComponent() {
      return null;
    }
    function WithDisplayName() {
      return null;
    }
    WithDisplayName.displayName = 'MyDisplayName';

    const hoc1 = withTheme({})(MyComponent);
    expect(hoc1.displayName).toBe('withTheme(MyComponent)');

    const hoc2 = withTheme({})(WithDisplayName);
    expect(hoc2.displayName).toBe('withTheme(MyDisplayName)');
  });

  it('passes the theme prop to the wrapped component', () => {
    expect.assertions(1);
    const testTheme = { my: 'theme' };
    function MyComponent({ theme }) {
      expect(theme).toEqual(expect.objectContaining(testTheme));

      return null;
    }
    const HOC = withTheme(testTheme)(MyComponent);
    shallow(<HOC />).dive();
  });

  it('passes the default theme when no theme is passed', () => {
    expect.assertions(1);
    function MyComponent({ theme }) {
      expect(theme).toEqual(expect.objectContaining(defaultTheme));

      return null;
    }
    const HOC = withTheme()(MyComponent);
    shallow(<HOC />).dive();
  });

  it('allows theme keys to be overridden', () => {
    const overrideTheme = { colors: 'my-colors' };
    function MyComponent() {
      return null;
    }
    const HOC = withTheme()(MyComponent);

    let wrapper = shallow(<HOC />);
    expect(wrapper.find(MyComponent).prop('theme')).toEqual(expect.objectContaining(defaultTheme));

    wrapper = shallow(<HOC theme={overrideTheme} />);
    expect(wrapper.find(MyComponent).prop('theme')).toEqual(expect.objectContaining(overrideTheme));
  });
});
