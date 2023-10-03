import { render } from '@testing-library/react';

import BaseStationDetailInfo from './base-station-detail-info';

describe('BaseStationDetailInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BaseStationDetailInfo />);
    expect(baseElement).toBeTruthy();
  });
});
