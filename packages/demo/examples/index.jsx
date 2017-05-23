import path from 'path';
import { storiesOf } from '@kadira/storybook';

const requireContext = require.context('./', /* subdirs= */true, /index\.jsx?$/);

requireContext.keys().forEach((packageName) => {
  if (packageName !== 'shared') {
    const examples = requireContext(packageName);
    if (examples && examples.default) {
      const name = path.dirname(packageName).slice(2); // no './'
      const stories = storiesOf(name, module);
      examples.default.forEach((example) => {
        stories.add(example.description, example.example);
      });
    }
  }
});
