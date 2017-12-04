/* eslint react/prop-types: 0 */
import React from 'react';

import ReactDndApp from './ReactDndApp';
import ReactGridApp from './ReactGridApp';

export default {
  examples: [
    {
      description: 'react-dnd-beautiful',
      example: () => (
        <ReactDndApp />
      ),
    },
    {
      description: 'react-grid-layout',
      example: () => (
        <ReactGridApp />
      ),
    },
  ],
};
