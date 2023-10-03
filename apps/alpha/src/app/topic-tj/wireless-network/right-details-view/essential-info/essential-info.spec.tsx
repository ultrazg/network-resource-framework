import { render } from '@testing-library/react';

import EssentialInfo from './essential-info';

describe('EssentialInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EssentialInfo />);
    expect(baseElement).toBeTruthy();
  });
});
