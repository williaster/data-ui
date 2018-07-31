import React from 'react';
import { shallow, mount } from 'enzyme';
import { Network, WithTooltip, Nodes, Links } from '../../src';
import defaultGraph from '../data';

import MockLayout from '../fixtures/MockLayout';

const layout = new MockLayout();

describe('<Network />', () => {
  const props = {
    ariaLabel: 'test',
    height: 100,
    width: 100,
    graph: defaultGraph,
  };

  it('should be defined', () => {
    expect(Network).toBeDefined();
  });

  it('should render a <WithTooltip /> when renderTooltip is passed', () => {
    const wrapper = shallow(<Network {...props} renderTooltip={() => {}} />);
    expect(wrapper.find(WithTooltip)).toHaveLength(1);
  });

  it('should not render a <WithTooltip /> when renderTooltip is not passed', () => {
    const wrapper = shallow(<Network {...props} renderTooltip={null} />);
    expect(wrapper.find(WithTooltip)).toHaveLength(0);
  });

  it('should render an svg', () => {
    const wrapper = mount(<Network {...props} />);
    expect(wrapper.find('svg')).toHaveLength(1);
  });

  it('should render any additional children passed within the svg', () => {
    const wrapper = mount(
      <Network {...props}>
        <defs>
          <filter id="test_filter" />
        </defs>
      </Network>,
    );
    expect(wrapper.find('svg').find('#test_filter')).toHaveLength(1);
  });

  it('should show initial status of rendering', () => {
    const wrapper = mount(<Network {...props} />);
    expect(wrapper.find('text')).toHaveLength(1);
  });

  it('should render correct number of nodes and links', () => {
    const wrapper = mount(<Network {...props} layout={layout} />);
    expect(wrapper.find('.cx-group.data-ui-nodes')).toHaveLength(defaultGraph.nodes.length);
    expect(wrapper.find('.cx-group.data-ui-links')).toHaveLength(defaultGraph.links.length);
  });

  it('should render the orignal x and y when scaleToFit is false', () => {
    const wrapper = mount(<Network {...props} layout={layout} scaleToFit={false} />);
    defaultGraph.nodes.forEach(node => {
      const groupWrapper = wrapper.find('.cx-group.data-ui-nodes');
      const transformString = `translate(${node.x}, ${node.y})`;
      expect(groupWrapper.find({ transform: transformString })).toHaveLength(1);
    });
  });

  it('should render the graph for animation enabled graph with little delay', done => {
    expect.assertions(2);
    const wrapper = mount(<Network {...props} animated />);

    setTimeout(() => {
      wrapper.update();
      expect(wrapper.find(Nodes)).toHaveLength(1);
      expect(wrapper.find(Links)).toHaveLength(1);
      done();
    }, 20);
  });

  it('should handle mouse events correctly', done => {
    expect.assertions(3);
    const { graph } = props;
    const expectedId = graph.nodes[0].id;
    let testID = null;

    function onMouseEvent({ id }) {
      testID = id;
    }

    const wrapper = mount(
      <Network
        onMouseLeave={onMouseEvent}
        onMouseEnter={onMouseEvent}
        onClick={onMouseEvent}
        {...props}
        animated
      />,
    );

    setTimeout(() => {
      wrapper.update();

      const node = wrapper.find('circle').first();
      node.simulate('click');
      expect(testID).toBe(expectedId);

      testID = null;
      node.simulate('mouseEnter');
      expect(testID).toBe(expectedId);

      testID = null;
      node.simulate('mouseLeave');
      expect(testID).toBe(expectedId);

      done();
    }, 20);
  });

  it('should call the eventTriggerRefs callback on mount', () => {
    expect.assertions(5);

    function eventTriggerRefs(refs) {
      expect(refs).toEqual(expect.any(Object));
      expect(refs.click).toEqual(expect.any(Function));
      expect(refs.mouseenter).toEqual(expect.any(Function));
      expect(refs.mousemove).toEqual(expect.any(Function));
      expect(refs.mouseleave).toEqual(expect.any(Function));
    }

    mount(<Network {...props} eventTriggerRefs={eventTriggerRefs} />);
  });

  it('should pass coords to mouse handlers according to the snapTooltipToData* props', () => {
    const onMouseMove = jest.fn();
    const onClick = jest.fn();
    const { graph } = props;
    const callbackArgs = { data: graph.nodes[0] };

    function eventTriggerRefs(refs) {
      refs.click(callbackArgs);
      refs.mousemove(callbackArgs);
    }

    mount(
      <Network
        onMouseMove={onMouseMove}
        onClick={onClick}
        snapTooltipToDataX={false}
        snapTooltipToDataY={false}
        eventTriggerRefs={eventTriggerRefs}
        {...props}
        animated
      />,
    );

    expect(onMouseMove.mock.calls[0][0].coords.x).toBeUndefined();
    expect(onMouseMove.mock.calls[0][0].coords.y).toBeUndefined();
    expect(onClick.mock.calls[0][0].coords.x).toBeUndefined();
    expect(onClick.mock.calls[0][0].coords.y).toBeUndefined();

    mount(
      <Network
        onMouseMove={onMouseMove}
        onClick={onClick}
        snapTooltipToDataX
        snapTooltipToDataY={false}
        eventTriggerRefs={eventTriggerRefs}
        {...props}
        animated
      />,
    );

    expect(onMouseMove.mock.calls[1][0].coords.x).toEqual(expect.any(Number));
    expect(onMouseMove.mock.calls[1][0].coords.y).toBeUndefined();
    expect(onClick.mock.calls[1][0].coords.x).toEqual(expect.any(Number));
    expect(onClick.mock.calls[1][0].coords.y).toBeUndefined();

    mount(
      <Network
        onMouseMove={onMouseMove}
        onClick={onClick}
        snapTooltipToDataY
        {...props}
        animated
      />,
    );

    expect(onMouseMove.mock.calls[1][0].coords.x).toEqual(expect.any(Number));
    expect(onMouseMove.mock.calls[1][0].coords.y).toBeUndefined();
    expect(onClick.mock.calls[1][0].coords.x).toEqual(expect.any(Number));
    expect(onClick.mock.calls[1][0].coords.y).toBeUndefined();
  });
});
