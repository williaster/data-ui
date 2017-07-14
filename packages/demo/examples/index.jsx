/*
 * Iterates over folders in the current directory and renders stories for each example
 * exported by that folder.
 * Example exports should have the following shape:
 *  {
 *    usage: {String},
 *    examples: [
 *      {
 *        description: {String} name of the story
 *        components: {Array<{func}>} array of component funcs for which proptables will be shown
 *        example: {func} () => story,
 *        usage: {String}, overrides top-level usage if passed
 *      }
 *    ],
 *  }
 */
import path from 'path';
import { storiesOf } from '@storybook/react';
import GoogleAnalyticsDecorator from '../storybook-config/components/GoogleAnalytics';

const requireContext = require.context('./', /* subdirs= */true, /index\.jsx?$/);

requireContext.keys().forEach((packageName) => {
  if (packageName !== 'shared') {
    const packageExport = requireContext(packageName);
    if (packageExport && packageExport.default && !Array.isArray(packageExport.default)) {
      const { examples, usage } = packageExport.default;
      let name = path.dirname(packageName).slice(2); // no './'
      if ((/^\d\d-/).test(name)) name = name.slice(3); // no 'XX-'

      const stories = storiesOf(name, module);

      // log story views + events
      stories.addDecorator(GoogleAnalyticsDecorator);

      // wrap stories
      examples.forEach((example) => {
        stories.addWithInfo({
          storyName: example.description,
          storyFn: example.example,
          components: example.components,
          usage: example.usage || usage,
          useHOC: example.useHOC,
        });
      });
    }
  }
});
