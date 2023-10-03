import { render } from '@testing-library/react';

import DevEssentials from './dev-essentials';

describe('DevEssentials', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DevEssentials />);
    expect(baseElement).toBeTruthy();
  });
});
