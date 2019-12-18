import React from 'react';
import { render, mount } from 'enzyme';

import { WithTooltip, withTooltipPropTypes } from '../../src';

global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

describe('<WithTooltip />', () => {
  it('WithTooltip should be defined', () => {
    expect(WithTooltip).toBeDefined();
  });

  it('withTooltipPropTypes should be defined', () => {
    expect(withTooltipPropTypes).toBeDefined();
  });

  it('it should render component-type children and call function-type children', () => {
    function MyComponent() {
      return <div id="test" />;
    }

    let wrapper = render(<WithTooltip renderTooltip={() => null}>{MyComponent}</WithTooltip>);
    expect(wrapper.find('#test')).toHaveLength(1);

    wrapper = render(<WithTooltip renderTooltip={() => null}>{<MyComponent />}</WithTooltip>);
    expect(wrapper.find('#test')).toHaveLength(1);
  });

  it('it should pass onMouseMove, onMouseLeave, tooltipData to children', () => {
    let data;
    let mouseMove;
    function MyComponent({ onMouseMove, onMouseLeave, tooltipData }) {
      expect(onMouseMove).toBeDefined();
      expect(onMouseLeave).toBeDefined();
      mouseMove = onMouseMove;
      data = tooltipData;

      return null;
    }

    mount(<WithTooltip renderTooltip={() => null}>{MyComponent}</WithTooltip>);

    mouseMove({});
    expect(data).toBeDefined();
    data = null;

    mount(<WithTooltip renderTooltip={() => null}>{<MyComponent />}</WithTooltip>);

    mouseMove({});
    expect(data).toBeDefined();
  });

  it('it should render the return value of renderTooltip on mouse move', () => {
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
    expect(wrapper.find('#test')).toHaveLength(1);
  });

  it('it should invoke the passed onMouseMove when the provided onMouseMove is invoked', () => {
    const passedOnMouseMove = jest.fn();

    let providedMouseMove;
    const wrapper = mount(
      <WithTooltip renderTooltip={() => null} onMouseMove={passedOnMouseMove}>
        {({ onMouseMove }) => {
          providedMouseMove = onMouseMove;

          return <svg />;
        }}
      </WithTooltip>,
    );

    providedMouseMove({});
    wrapper.update();
    expect(passedOnMouseMove).toHaveBeenCalledTimes(1);
  });

  it('it should invoke the passed onMouseLeave when the provided onMouseLeave is invoked', () => {
    const passedOnMouseLeave = jest.fn();

    let providedMouseLeave;
    const wrapper = mount(
      <WithTooltip renderTooltip={() => null} onMouseLeave={passedOnMouseLeave}>
        {({ onMouseLeave }) => {
          providedMouseLeave = onMouseLeave;

          return <svg />;
        }}
      </WithTooltip>,
    );

    providedMouseLeave({});
    wrapper.update();
    expect(passedOnMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('it should use the provided `coords` if passed to onMouseMove', () => {
    let mouseMove;
    const wrapper = mount(
      <WithTooltip
        TooltipComponent={({ top, left, children }) => (
          <div style={{ top, left }} id="tooltip">
            {children}
          </div>
        )}
        renderTooltip={() => <div id="test" />}
      >
        {({ onMouseMove }) => {
          mouseMove = onMouseMove;

          return <svg />;
        }}
      </WithTooltip>,
    );

    mouseMove({ coords: {} });
    wrapper.update();
    expect(wrapper.find('#tooltip').prop('style').top).toBe(0);
    expect(wrapper.find('#tooltip').prop('style').left).toBe(0);

    mouseMove({ coords: { x: 27, y: 13 } });
    wrapper.update();
    expect(wrapper.find('#tooltip').prop('style').top).toBe(13);
    expect(wrapper.find('#tooltip').prop('style').left).toBe(27);
  });

  it('it should not render a tooltip if renderTooltip returns a falsy value', () => {
    const renderTooltip = jest.fn();
    renderTooltip.mockReturnValue(<div id="test" />);

    let mouseMove;
    const wrapper = mount(
      <WithTooltip
        TooltipComponent={({ children }) => <div id="tooltip">{children}</div>}
        renderTooltip={renderTooltip}
      >
        {({ onMouseMove }) => {
          mouseMove = onMouseMove;

          return <svg />;
        }}
      </WithTooltip>,
    );

    mouseMove({});
    wrapper.update();
    expect(renderTooltip).toHaveBeenCalledTimes(1);
    expect(wrapper.find('#tooltip')).toHaveLength(1);
    expect(wrapper.find('#test')).toHaveLength(1);

    renderTooltip.mockReturnValue(null);
    mouseMove({});
    wrapper.update();
    expect(renderTooltip).toHaveBeenCalledTimes(2);
    expect(wrapper.find('#tooltip')).toHaveLength(0);
    expect(wrapper.find('#test')).toHaveLength(0);
  });

  it('it should hide the value of renderTooltip on mouse leave', () => {
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
    expect(wrapper.find('#test')).toHaveLength(1);

    mouseLeave({});
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('#test')).toHaveLength(0);
  });

  it('it should render the passed TooltipComponent and pass it left and top props', () => {
    expect.assertions(3);

    // eslint-disable-next-line react/prop-types
    function Tooltip({ left, top }) {
      expect(left).toEqual(expect.any(Number));
      expect(top).toEqual(expect.any(Number));

      return <div id="test" />;
    }

    let mouseMove;
    const wrapper = mount(
      <WithTooltip renderTooltip={() => 'test'} TooltipComponent={Tooltip}>
        {({ onMouseMove }) => {
          mouseMove = onMouseMove;
        }}
      </WithTooltip>,
    );

    mouseMove({});
    wrapper.update();
    expect(wrapper.find('#test')).toHaveLength(1);
  });

  it('it should pass className and styles props to the wrapper container', () => {
    const styles = { color: 'pink' };
    const className = 'i-like-tooltipz';

    const wrapper = render(
      <WithTooltip renderTooltip={() => null} className={className} styles={styles}>
        {() => null}
      </WithTooltip>,
    );

    const container = wrapper.find(`.${className}`);
    expect(container).toHaveLength(1);
    expect(container.prop('style')).toMatchObject(styles);
  });

  it('it should pass tooltipProps to TooltipComponent', () => {
    const tooltipProps = {
      fill: 'pink',
      minWidth: 200,
    };

    const propsToCheck = Object.keys(tooltipProps);

    function Tooltip(props) {
      propsToCheck.forEach(prop => {
        // eslint-disable-next-line react/destructuring-assignment
        expect(props[prop]).toBe(tooltipProps[prop]);
      });

      return <div />;
    }

    let mouseMove;
    const wrapper = mount(
      <WithTooltip
        renderTooltip={() => 'test'}
        TooltipComponent={Tooltip}
        tooltipProps={tooltipProps}
      >
        {({ onMouseMove }) => {
          mouseMove = onMouseMove;
        }}
      </WithTooltip>,
    );

    mouseMove({});
    wrapper.update();
    expect.assertions(propsToCheck.length);
  });
});
