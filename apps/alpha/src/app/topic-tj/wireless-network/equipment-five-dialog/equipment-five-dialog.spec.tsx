import { render } from '@testing-library/react';

import EquipmentFiveDialog from './equipment-five-dialog';

describe('EquipmentFiveDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EquipmentFiveDialog />);
    expect(baseElement).toBeTruthy();
  });
});
