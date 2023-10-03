import { render } from '@testing-library/react';

import DatasNetwork from './datas-network';

describe('DatasNetwork', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DatasNetwork />);
    expect(baseElement).toBeTruthy();
  });
});
