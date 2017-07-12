import path from 'path';
import { storiesOf } from '@storybook/react';
import GADecorator from '../components/GADecorator';

const requireContext = require.context('./', /* subdirs= */true, /index\.jsx?$/);

requireContext.keys().forEach((packageName) => {
  if (packageName !== 'shared') {
    const examples = requireContext(packageName);
    if (examples && examples.default) {
      const name = path.dirname(packageName).slice(2); // no './'
      const stories = storiesOf(name, module);

      stories.addDecorator(GADecorator);

      examples.default.forEach((example) => {
        stories.add(example.description, example.example);
      });
    }
  }
});
