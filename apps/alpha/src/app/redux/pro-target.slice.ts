import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  Dispatch,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';

import { fetchBuildings } from '@alpha/api/data';
import { ResType } from '../../api/resIndicator';

export const REDUX_PROTARGET_FEATURE_KEY = 'reduxProTarget';

/*
 * Update these interfaces according to your requirements.
 */
export interface ReduxProTargetEntity {
  id: number;
}

export interface ReduxProTargetState extends EntityState<ReduxProTargetEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error: string | null | undefined;
  resType?: ResType;
  autoSwitch: boolean;
}

export const reduxProTargetAdapter =
  createEntityAdapter<ReduxProTargetEntity>();

export const fetchReduxProTarget = createAsyncThunk(
  'reduxProTarget/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getReduxProTargets()`;
     * Right now we just return an empty array.
     */
    return fetchBuildings().then((res: any) => {
      return res.data.map((item: any) => {
        return {
          id: Number(item.province),
          ...item,
        };
      });
    });
  }
);

export const initialReduxProTargetState: ReduxProTargetState =
  reduxProTargetAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
    resType: undefined,
    autoSwitch: true,
  });

export const reduxProTargetSlice = createSlice({
  name: REDUX_PROTARGET_FEATURE_KEY,
  initialState: initialReduxProTargetState,
  reducers: {
    add: reduxProTargetAdapter.addOne,
    remove: reduxProTargetAdapter.removeOne,
    changeResType(state, action: PayloadAction<ResType>) {
      state.resType = action.payload;
    },
    changeAutoSwitch(state, action: PayloadAction<boolean>) {
      state.autoSwitch = action.payload;
    },
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReduxProTarget.pending, (state: ReduxProTargetState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchReduxProTarget.fulfilled,
        (
          state: ReduxProTargetState,
          action: PayloadAction<ReduxProTargetEntity[]>
        ) => {
          reduxProTargetAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(
        fetchReduxProTarget.rejected,
        (state: ReduxProTargetState, action) => {
          state.loadingStatus = 'error';
          state.error = action.error.message;
        }
      );
  },
});

/*
 * Export reducer for store configuration.
 */
export const reduxProTargetReducer = reduxProTargetSlice.reducer;

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
 *   dispatch(reduxProTargetActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const reduxProTargetActions = reduxProTargetSlice.actions;

/**
 * dispatch(delaySwitch(120));
 */
let timer = 0;
export const delaySwitch = (second: number = 120 /** 延迟时间，单位秒 */) => {
  return (dispatch: Dispatch) => {
    dispatch(reduxProTargetActions.changeAutoSwitch(false));
    timer && window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      dispatch(reduxProTargetActions.changeAutoSwitch(true));
    }, second * 1000);
  };
};

/**
 * dispatch(pauseSwitch());
 */
export const pauseSwitch = () => {
  return (dispatch: Dispatch) => {
    timer && window.clearTimeout(timer);
    dispatch(reduxProTargetActions.changeAutoSwitch(false));
  }
}

/**
 * dispatch(restoreSwitch());
 */
export const restoreSwitch = () => {
  return (dispatch: Dispatch) => {
    timer && window.clearTimeout(timer);
    dispatch(reduxProTargetActions.changeAutoSwitch(true));
  }
}

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllReduxProTarget);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = reduxProTargetAdapter.getSelectors();

export const getReduxProTargetState = (rootState: any): ReduxProTargetState =>
  rootState[REDUX_PROTARGET_FEATURE_KEY];

export const selectAllReduxProTarget = createSelector(
  getReduxProTargetState,
  selectAll
);

export const selectReduxProTargetEntities = createSelector(
  getReduxProTargetState,
  selectEntities
);

export const selectResType = createSelector(
  getReduxProTargetState,
  (state: ReduxProTargetState) => state.resType
);

export const selectAutoSwitch = createSelector(
  getReduxProTargetState,
  (state: ReduxProTargetState) => state.autoSwitch
);
