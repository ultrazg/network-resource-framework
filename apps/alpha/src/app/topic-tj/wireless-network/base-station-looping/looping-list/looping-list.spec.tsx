import { render } from '@testing-library/react';

import LoopingList from './looping-list';

describe('LoopingList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoopingList />);
    expect(baseElement).toBeTruthy();
  });
});
