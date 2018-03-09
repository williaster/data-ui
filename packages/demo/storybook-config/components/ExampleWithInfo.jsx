import PropTypes from 'prop-types';
import React from 'react';

import Markdown from './Markdown';
import PropTable from './PropTable';
import SourceView from './ReactSourceView';
import TabItem from './TabItem';
import { css, withStyles, withStylesPropTypes } from '../../themes/withStyles';

const propTypes = {
  ...withStylesPropTypes,
  kind: PropTypes.string.isRequired,
  story: PropTypes.string.isRequired,
  storyFn: PropTypes.func.isRequired,
  components: PropTypes.arrayOf(PropTypes.func),
  usage: PropTypes.string,
  useHOC: PropTypes.bool,
  analytics: PropTypes.func,
};

const defaultProps = {
  usage: null,
  components: [],
  analytics() {},
  useHOC: false,
};

class ExampleWithInfo extends React.Component {
  constructor(props) {
    super(props);
    this.handlePressTab = this.handlePressTab.bind(this);
    this.state = { activeTab: 'demo' };
  }

  setTab(tab) {
    this.setState({ activeTab: tab });
  }

  handlePressTab(activeTab) {
    const { kind, story, analytics } = this.props;
    this.setState({ activeTab });
    analytics({ kind, story, tab: activeTab });
  }

  render() {
    const { styles, storyFn, components, usage, useHOC, hideTabs } = this.props;
    const { activeTab } = this.state;

    const demoTab = activeTab === 'demo';
    const propTableTab = activeTab === 'propTable';
    const sourceTab = activeTab === 'source';
    const usageTab = activeTab === 'usage';

    return (
      <div {...css(styles.container)}>
        {!hideTabs && (
          <div {...css(styles.tabs)}>
            <TabItem
              active={demoTab}
              onPress={() => {
                this.handlePressTab('demo');
              }}
            >
              Demo
            </TabItem>
            <TabItem
              active={propTableTab}
              disabled={!components || components.length === 0}
              onPress={() => {
                this.handlePressTab('propTable');
              }}
            >
              Prop table
            </TabItem>
            <TabItem
              active={sourceTab}
              onPress={() => {
                this.handlePressTab('source');
              }}
            >
              Source
            </TabItem>
            <TabItem
              active={usageTab}
              disabled={!usage}
              onPress={() => {
                this.handlePressTab('usage');
              }}
              noSpacer
            >
              Usage
            </TabItem>
          </div>
        )}
        <div>
          {demoTab && storyFn()}
          {propTableTab &&
            components.map((component, i) => (
              <PropTable
                key={`${component.displayName || component.name || i}`}
                component={component}
                useHOC={useHOC}
              />
            ))}
          {sourceTab && <SourceView useHOC={useHOC}>{storyFn()}</SourceView>}
          {usageTab && usage && <Markdown source={usage} />}
        </div>
      </div>
    );
  }
}

ExampleWithInfo.propTypes = propTypes;
ExampleWithInfo.defaultProps = defaultProps;

export default withStyles(
  ({ color, unit }) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },

    tabs: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'no-wrap',
      borderBottom: `1px solid ${color.grays[1]}`,
      marginBottom: 1 * unit,
    },
  }),
  { pureComponent: false },
)(ExampleWithInfo);
