import React from 'react';
import { render } from '@testing-library/react';

import Block from './block';

describe('Block', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Block
        blockStyle={{
          top: '20px',
          left: '20px',
          width: '20px',
          height: '20px',
        }}
        blockBackground={true}
        blockCorner={true}
        title={'test'}
      >
        <div>Test</div>
      </Block>
    );
    expect(baseElement).toBeTruthy();
  });
});
