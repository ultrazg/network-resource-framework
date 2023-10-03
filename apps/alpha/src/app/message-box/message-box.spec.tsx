import { render } from '@testing-library/react';

import MessageBox from './message-box';

describe('MessageBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MessageBox />);
    expect(baseElement).toBeTruthy();
  });
});
