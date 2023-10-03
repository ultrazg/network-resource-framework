import {
  fetchReduxChinaMap,
  reduxChinaMapAdapter,
  reduxChinaMapReducer,
} from './redux/china-map.slice';

describe('reduxChinaMap reducer', () => {
  it('should handle initial state', () => {
    const expected = reduxChinaMapAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(reduxChinaMapReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchReduxChinaMaps', () => {
    let state = reduxChinaMapReducer(
      undefined,
      fetchReduxChinaMap.pending(null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = reduxChinaMapReducer(
      state,
      fetchReduxChinaMap.fulfilled([{ id: 1 }], null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = reduxChinaMapReducer(
      state,
      fetchReduxChinaMap.rejected(new Error('Uh oh'), null, null)
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
