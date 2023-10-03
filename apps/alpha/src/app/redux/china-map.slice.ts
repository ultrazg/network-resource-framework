import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { nanoid } from 'nanoid';

import { getMapRes } from '@alpha/api/data';

export const REDUX_CHINAMAP_FEATURE_KEY = 'reduxChinaMap';

/*
 * Update these interfaces according to your requirements.
 */
export interface ReduxChinaMapEntity {
  name: string;
  id: number;
}

export interface ReduxChinaMapState extends EntityState<ReduxChinaMapEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string | null | undefined;
}

export const reduxChinaMapAdapter = createEntityAdapter<ReduxChinaMapEntity>();

type ResMapParams = {
  profess: string;
  day?: string;
  province?: string;
};

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchReduxChinaMap())
 * }, [dispatch]);
 * ```
 *
 * type
 * 核心网: coreNet
 * 数据网: dataNet
 * 接入网: accessNet
 * Idc资源: idcRes
 * 国际资源: internationalRes
 * 光缆网: optNet
 * 空间资源: spcRes
 * 传输网: trsNet
 * 无线资源: wireNet
 */
export const fetchReduxChinaMap = createAsyncThunk(
  'reduxChinaMap/fetch',
  async (params: ResMapParams, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getReduxChinaMaps()`;
     * Right now we just return an empty array.
     */
    return getMapRes(params).then((data: any) => {
      return data.data.map((item: any) => {
        return {
          id: nanoid(),
          ...item,
        };
      });
    });
  }
);

export const initialReduxChinaMapState: ReduxChinaMapState =
  reduxChinaMapAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
  });

export const reduxChinaMapSlice = createSlice({
  name: REDUX_CHINAMAP_FEATURE_KEY,
  initialState: initialReduxChinaMapState,
  reducers: {
    add: reduxChinaMapAdapter.addOne,
    remove: reduxChinaMapAdapter.removeOne,
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReduxChinaMap.pending, (state: ReduxChinaMapState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchReduxChinaMap.fulfilled,
        (
          state: ReduxChinaMapState,
          action: PayloadAction<ReduxChinaMapEntity[]>
        ) => {
          reduxChinaMapAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(
        fetchReduxChinaMap.rejected,
        (state: ReduxChinaMapState, action) => {
          state.loadingStatus = 'error';
          state.error = action.error.message;
        }
      );
  },
});

/*
 * Export reducer for store configuration.
 */
export const reduxChinaMapReducer = reduxChinaMapSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(reduxChinaMapActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const reduxChinaMapActions = reduxChinaMapSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllReduxChinaMap);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = reduxChinaMapAdapter.getSelectors();

export const getReduxChinaMapState = (rootState: any): ReduxChinaMapState =>
  rootState[REDUX_CHINAMAP_FEATURE_KEY];

export const selectAllReduxChinaMap = createSelector(
  getReduxChinaMapState,
  selectAll
);

export const selectReduxChinaMapEntities = createSelector(
  getReduxChinaMapState,
  selectEntities
);
