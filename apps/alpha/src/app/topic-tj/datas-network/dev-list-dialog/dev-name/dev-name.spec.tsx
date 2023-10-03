import { render } from '@testing-library/react';

import DevName from './dev-name';

describe('DevName', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DevName />);
    expect(baseElement).toBeTruthy();
  });
});
