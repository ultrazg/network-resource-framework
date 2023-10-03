import { render } from '@testing-library/react';

import MapSearch from './map-search';

describe('MapSearch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapSearch formItems={[]} defaultValue={{}}/>);
    expect(baseElement).toBeTruthy();
  });
});
