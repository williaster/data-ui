import React from 'react';
import { storiesOf } from '@kadira/storybook';

import Table from '@data-ui/data-table';

storiesOf('data-table', module)
  .add('Basic', () => (
    <Table.Table />
  ));
