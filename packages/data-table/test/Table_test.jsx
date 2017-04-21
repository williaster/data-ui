import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Table from '../src/components/Table';

describe('Table', () => {
  it('is valid element', () => {
    expect(React.isValidElement(<Table />)).to.equal(true);
  });
});
