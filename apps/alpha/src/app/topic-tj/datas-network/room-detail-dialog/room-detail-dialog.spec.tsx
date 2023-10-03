import { render } from '@testing-library/react';

import RoomDetailDialog from './room-detail-dialog';

describe('RoomDetailDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RoomDetailDialog />);
    expect(baseElement).toBeTruthy();
  });
});
