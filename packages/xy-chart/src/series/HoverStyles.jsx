// Using this approach lets us avoid saving hove state on all of the mouseover events.
import React from 'react';

export default () => (
  <style type="text/css">{`
    .vx-bar:hover,
    .vx-glyph-dot:hover {
      opacity: 0.7;
    }
  `}</style>
);
