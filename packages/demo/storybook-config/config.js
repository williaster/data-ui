/* eslint global-require: 0 */
import { configure } from '@storybook/react';

function loadStories() {
  require('../examples/index');
}

configure(loadStories, module);
