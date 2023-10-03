import { render } from '@testing-library/react';

import OperationSchedule from './operation-schedule';

describe('OperationSchedule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OperationSchedule />);
    expect(baseElement).toBeTruthy();
  });
});
