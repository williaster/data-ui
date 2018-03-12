import React from 'react';
import { shallow } from 'enzyme';

import { FocusBlurHandler } from '../../src';

describe('<FocusBlurHandler />', () => {
  test('it should be defined', () => {
    expect(FocusBlurHandler).toBeDefined();
  });

  test('it should render an <a /> tag', () => {
    const wrapper = shallow(<FocusBlurHandler />);
    expect(wrapper.find('a')).toHaveLength(1);
  });

  test('it should render its children', () => {
    const wrapper = shallow(<svg><FocusBlurHandler><circle id="test" /></FocusBlurHandler></svg>);
    expect(wrapper.find(FocusBlurHandler).dive().find('circle#test')).toHaveLength(1);
  });

  test('it should invoke onFocus when focused', () => {
    const onFocus = jest.fn();
    const wrapper = shallow(<FocusBlurHandler onFocus={onFocus} />);

    wrapper.find('a').simulate('focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  test('it should invoke onBlur when blurred', () => {
    const onBlur = jest.fn();
    const wrapper = shallow(<FocusBlurHandler onBlur={onBlur} />);

    wrapper.find('a').simulate('blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
