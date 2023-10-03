import { render } from '@testing-library/react';

import ResourceQualityV2 from './resource-quality-v2';

describe('ResourceQualityV2', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResourceQualityV2 />);
    expect(baseElement).toBeTruthy();
  });
});
