import { render } from '@testing-library/react';

import IdcResourceAnalysis from './idc-resource-analysis';

describe('IdcResourceAnalysis', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IdcResourceAnalysis />);
    expect(baseElement).toBeTruthy();
  });
});
