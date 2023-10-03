import {
  fetchReduxProTarget,
  reduxProTargetAdapter,
  reduxProTargetReducer,
} from './redux/pro-target.slice';

describe('reduxProTarget reducer', () => {
  it('should handle initial state', () => {
    const expected = reduxProTargetAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(reduxProTargetReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchReduxProTargets', () => {
    let state = reduxProTargetReducer(
      undefined,
      fetchReduxProTarget.pending(null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = reduxProTargetReducer(
      state,
      fetchReduxProTarget.fulfilled([{ id: 1 }], null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = reduxProTargetReducer(
      state,
      fetchReduxProTarget.rejected(new Error('Uh oh'), null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
