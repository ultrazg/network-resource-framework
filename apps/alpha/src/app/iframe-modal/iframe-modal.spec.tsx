import { render } from '@testing-library/react';

import IframeModal from './iframe-modal';

describe('IframeModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IframeModal fn={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
