import React from 'react';
import { render, mount } from 'enzyme';

import { WithTooltip, withTooltipPropTypes } from '../../src';

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};

describe('<WithTooltip />', () => {
  test('WithTooltip should be defined', () => {
    expect(WithTooltip).toBeDefined();
  });

  test('withTooltipPropTypes should be defined', () => {
    expect(withTooltipPropTypes).toBeDefined();
  });

  test('it should render component-type children and call function-type children', () => {
    function MyComponent() {
      return <div id="test" />;
    }

    let wrapper = render(
      <WithTooltip renderTooltip={() => null}>
        {MyComponent}
      </WithTooltip>,
    );
    expect(wrapper.find('#test').length).toBe(1);

    wrapper = render(
      <WithTooltip renderTooltip={() => null}>
        {<MyComponent />}
      </WithTooltip>,
    );
    expect(wrapper.find('#test').length).toBe(1);
  });

  test('it should pass onMouseMove, onMouseLeave, tooltipData to children', () => {
    let data;
    let mouseMove;
    function MyComponent({ onMouseMove, onMouseLeave, tooltipData }) {
      expect(onMouseMove).toBeDefined();
      expect(onMouseLeave).toBeDefined();
      mouseMove = onMouseMove;
      data = tooltipData;
      return null;
    }

    mount(
      <WithTooltip renderTooltip={() => null}>
        {MyComponent}
      </WithTooltip>,
    );

    mouseMove({});
    expect(data).toBeDefined();
    data = null;

    mount(
      <WithTooltip renderTooltip={() => null}>
        {<MyComponent />}
      </WithTooltip>,
    );

    mouseMove({});
    expect(data).toBeDefined();
  });

  test('it should render the return value of renderTooltip on mouse move', () => {
    const renderTooltip = jest.fn();
    renderTooltip.mockReturnValue(<div id="test" />);

    let mouseMove;
    const wrapper = mount(
      <WithTooltip renderTooltip={renderTooltip}>
        {({ onMouseMove }) => {
          mouseMove = onMouseMove;
          return <svg />;
        }}
      </WithTooltip>,
    );

    mouseMove({});
    wrapper.update();
    expect(renderTooltip).toHaveBeenCalledTimes(1);
    expect(wrapper.find('#test').length).toBe(1);
  });

  test('it should hide the value of renderTooltip on mouse leave', () => {
    jest.useFakeTimers(); // needed for mouseLeave timeout

    const renderTooltip = jest.fn();
    renderTooltip.mockReturnValue(<div id="test" />);

    let mouseMove;
    let mouseLeave;
    const wrapper = mount(
      <WithTooltip renderTooltip={renderTooltip} tooltipTimeout={0}>
        {({ onMouseMove, onMouseLeave }) => {
          mouseMove = onMouseMove;
          mouseLeave = onMouseLeave;
          return null;
        }}
      </WithTooltip>,
    );

    mouseMove({});
    wrapper.update();
    expect(renderTooltip).toHaveBeenCalledTimes(1);
    expect(wrapper.find('#test').length).toBe(1);

    mouseLeave({});
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('#test').length).toBe(0);
  });

  test('it should render the passed TooltipComponent and pass it left and top props', () => {
    function Tooltip({ left, top }) { // eslint-disable-line
      expect(left).toEqual(expect.any(Number));
      expect(top).toEqual(expect.any(Number));
      return <div id="test" />;
    }

    let mouseMove;
    const wrapper = mount(
      <WithTooltip
        renderTooltip={() => null}
        TooltipComponent={Tooltip}
      >
        {({ onMouseMove }) => {
          mouseMove = onMouseMove;
        }}
      </WithTooltip>,
    );

    mouseMove({});
    wrapper.update();
    expect(wrapper.find('#test').length).toBe(1);
  });

  test('it should pass className and styles props to the wrapper container', () => {
    const styles = { color: 'pink' };
    const className = 'i-like-tooltipz';

    const wrapper = render(
      <WithTooltip
        renderTooltip={() => null}
        className={className}
        styles={styles}
      >
        {() => null}
      </WithTooltip>,
    );

    const container = wrapper.find(`.${className}`);
    expect(container.length).toBe(1);
    expect(container.prop('style')).toMatchObject(styles);
  });
});
