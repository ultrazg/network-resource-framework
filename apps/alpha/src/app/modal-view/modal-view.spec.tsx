import { render } from '@testing-library/react';

import ModalView from './modal-view';

describe('ModalView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ModalView />);
    expect(baseElement).toBeTruthy();
  });
});
