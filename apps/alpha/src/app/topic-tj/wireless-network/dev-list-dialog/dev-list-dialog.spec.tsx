import { render } from '@testing-library/react';

import DevListDialog from './dev-list-dialog';

describe('DevListDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DevListDialog />);
    expect(baseElement).toBeTruthy();
  });
});
