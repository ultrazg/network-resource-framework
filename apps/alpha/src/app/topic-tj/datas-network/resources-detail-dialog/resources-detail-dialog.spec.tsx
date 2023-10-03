import { render } from '@testing-library/react';

import ResourcesDetailDialog from './resources-detail-dialog';

describe('ResourcesDetailDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResourcesDetailDialog />);
    expect(baseElement).toBeTruthy();
  });
});
