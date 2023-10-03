import { render } from '@testing-library/react';

import MapList from './map-list';

describe('MapList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MapList isShow={false} searchOver={false} listItem={[]}/>);
    expect(baseElement).toBeTruthy();
  });
});
