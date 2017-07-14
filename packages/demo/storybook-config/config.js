/* eslint global-require: 0 */
import React from 'react';
import { configure, setAddon } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import ExampleWithInfo from './components/ExampleWithInfo';
import { googleAnalytics } from '../storybook-config/components/GoogleAnalytics';

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
  addWithInfo({ storyName, storyFn, components, usage, useHOC }) {
    return this.add(storyName, () => (
      <ExampleWithInfo
        components={components}
        usage={usage}
        storyFn={storyFn}
        googleAnalytics={googleAnalytics}
        useHOC={useHOC}
      />
    ));
  },
});

function loadStories() {
  require('../examples/index');
}

configure(loadStories, module);
