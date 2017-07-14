import React from 'react';
import { withState } from 'recompose';

import {
  Button,
  Select,
  StepIncrementer,
} from '@data-ui/forms';

import readme from '../../node_modules/@data-ui/forms/README.md';

const formatLookup = {
  '-1': 'last',
  1: '1st',
  2: '2nd',
  3: '3rd',
  4: '4th',
  5: '5th',
};

const controlledSelect = withState('value', 'setValue', { value: 'b' });

export default {
  usage: readme,
  examples: [
    {
      description: 'Stepper',
      components: [StepIncrementer],
      example: () => (
        <StepIncrementer />
      ),
    },
    {
      description: 'Stepper -- disable zero, custom label',
      components: [StepIncrementer],
      example: () => (
        <StepIncrementer
          min={-1}
          max={5}
          formatValue={val => formatLookup[val]}
          disableZero
        />
      ),
    },
    {
      description: 'Select',
      components: [Select],
      example: () => (
        <Select
          options={[
            { value: 'a', label: 'a' },
            { value: 'b', label: 'b' },
            { value: 'c', label: 'c' },
          ]}
        />
      ),
    },
    {
      description: 'Select -- controlled',
      components: [Select],
      example: () => React.createElement(
        controlledSelect(({ value, setValue }) => (
          <Select
            value={value.value}
            onChange={setValue}
            options={[
              { value: 'a', label: 'a' },
              { value: 'b', label: 'b' },
              { value: 'c', label: 'c' },
            ]}
          />
        ),
      )),
    },
    {
      description: 'Button -- text',
      components: [Button],
      example: () => (
        <Button>Hello, world</Button>
      ),
    },
    {
      description: 'Button -- rounded',
      components: [Button],
      example: () => (
        <Button rounded>{'A bit round'}</Button>
      ),
    },
    {
      description: 'Button -- round, disabled',
      components: [Button],
      example: () => (
        <Button rounded disabled>x</Button>
      ),
    },
  ],
};
