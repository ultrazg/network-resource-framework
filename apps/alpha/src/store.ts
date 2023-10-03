import { configureStore } from '@reduxjs/toolkit';
import {
    REDUX_PROTARGET_FEATURE_KEY,
    reduxProTargetReducer,
  } from './app/redux/pro-target.slice';
  import {
    REDUX_CHINAMAP_FEATURE_KEY,
    reduxChinaMapReducer,
  } from './app/redux/china-map.slice';
  import {
    reduxContinentReducer,
    REDUX_CONTINENT_KEY,
  } from './app/redux/continent.slice';
import {
    reduxIframeResourceReducer,
    REDUX_IFRAME_RESOURCE_KEY,
  } from './app/redux/iframe.slice';
  import {
    reduxMapResourceReducer,
    REDUX_MAP_RESOURCE_KEY,
  } from './app/redux/map.slice';
const store = configureStore({
    reducer: {
      [REDUX_CHINAMAP_FEATURE_KEY]: reduxChinaMapReducer,
      [REDUX_PROTARGET_FEATURE_KEY]: reduxProTargetReducer,
      [REDUX_IFRAME_RESOURCE_KEY]: reduxIframeResourceReducer,
      [REDUX_CONTINENT_KEY]: reduxContinentReducer,
      [REDUX_MAP_RESOURCE_KEY]: reduxMapResourceReducer
    },
    // Additional middleware can be passed to this array
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env['NODE_ENV'] !== 'production',
    // Optional Redux store enhancers
    enhancers: [],
  });

export {
    store
  }