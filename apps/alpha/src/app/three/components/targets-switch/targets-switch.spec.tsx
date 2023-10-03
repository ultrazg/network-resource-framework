import { render } from '@testing-library/react';

import TargetsSwitch from './targets-switch';

describe('TargetsSwitch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TargetsSwitch />);
    expect(baseElement).toBeTruthy();
  });
});
