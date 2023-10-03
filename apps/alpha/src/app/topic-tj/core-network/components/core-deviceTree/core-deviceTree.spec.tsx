import { render } from '@testing-library/react';

import CoreDeviceTree from './core-deviceTree';

describe('CoreDeviceTree', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CoreDeviceTree />);
    expect(baseElement).toBeTruthy();
  });
});
