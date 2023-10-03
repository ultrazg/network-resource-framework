import { render } from '@testing-library/react';

import BaseStationDetail from './base-station-detail';

describe('BaseStationDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BaseStationDetail roomName={''} roomID={''} map={null} topic={0} />);
    expect(baseElement).toBeTruthy();
  });
});
