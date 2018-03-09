/* eslint global-require: 0 */
import React from 'react';
import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import ExampleWithInfo from './components/ExampleWithInfo';
import { analytics } from '../storybook-config/components/GoogleAnalytics';

// Customize the UI
setOptions({
  name: '📈 data-ui',
  url: 'https://williaster.github.io/data-ui',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: false,
  showSearchBox: false,
  downPanelInRight: false,
  sortStoriesByKind: false,
});

// add WithInfo addon which exposes proptables, usage, and source code for examples
setAddon({
  addWithInfo({ kind, story, storyFn, components, usage, useHOC, ...rest }) {
    return this.add(story, () => (
      <ExampleWithInfo
        kind={kind}
        story={story}
        storyFn={storyFn}
        components={components}
        usage={usage}
        useHOC={useHOC}
        analytics={analytics}
        {...rest}
      />
    ));
  },
});

function loadStories() {
  require('../examples/index');
}

configure(loadStories, module);
