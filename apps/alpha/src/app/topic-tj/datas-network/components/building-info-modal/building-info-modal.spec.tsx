import { render } from '@testing-library/react';

import BuildingInfoModal from './building-info-modal';

describe('BuildingInfoModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BuildingInfoModal />);
    expect(baseElement).toBeTruthy();
  });
});
