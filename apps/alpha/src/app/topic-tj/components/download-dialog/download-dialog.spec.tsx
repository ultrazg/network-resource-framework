import { render } from '@testing-library/react';

import DownloadDialog from './download-dialog';

describe('DownloadDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DownloadDialog />);
    expect(baseElement).toBeTruthy();
  });
});
