/* eslint global-require: 0 */
import { configure } from '@kadira/storybook';

function loadStories() {
  require('../examples/index');
}

configure(loadStories, module);
