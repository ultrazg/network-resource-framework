import React from 'react';
import { render } from '@testing-library/react';

import AnimateNumber from './animate-number';

describe('AnimateNumber', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AnimateNumber value={100} size={30} duration={2000} color="#ff6300" />
    );
    expect(baseElement).toBeTruthy();
  });
});
