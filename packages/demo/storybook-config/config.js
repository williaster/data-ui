/* eslint global-require: 0 */
import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

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

function loadStories() {
  require('../examples/index');
}

configure(loadStories, module);
