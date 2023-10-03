import { render } from '@testing-library/react';

import ToolTips from './tool-tips';

describe('ToolTips', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToolTips />);
    expect(baseElement).toBeTruthy();
  });
});
