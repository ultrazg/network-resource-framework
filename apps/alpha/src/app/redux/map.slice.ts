import { createSlice } from '@reduxjs/toolkit';
import { stat } from 'fs';
export const REDUX_MAP_RESOURCE_KEY = 'reduxMapResource';
export interface MapInfo {
  mapSelect: {
    topic: number,
    areaCode: number | string,
    provinceName: string,
    cityId: number | string,
    cityName: string,
    regionId: number | string,
    regionName: string,
  };
}

export const mapResourceSlice = createSlice({
  name: REDUX_MAP_RESOURCE_KEY,
  initialState: {
    mapSelect: {
      topic: 1,
      areaCode: '',
      provinceName: '',
      cityId: '',
      cityName: '',
      regionId: '',
      regionName: ''
    }
  } as MapInfo,
  reducers: {
    setMapSelect(state: MapInfo, { payload }: { payload: any}) {
      state.mapSelect = {
        ...state.mapSelect,
        areaCode: payload.areaCode,
        provinceName: payload.provinceName,
        cityId: payload.cityId || '',
        cityName: payload.cityName || '',
        regionId: payload.regionId || '',
        regionName: payload.regionName || '',
      }
    },
    setMapSelectTopic(state: MapInfo, { payload }: { payload: MapInfo['mapSelect']['topic'] }) {
      state.mapSelect.topic = payload;
    },
    setMapSelectAreaCode(state: MapInfo, { payload }: { payload: MapInfo['mapSelect']['areaCode'] }) {
      state.mapSelect.areaCode = payload;
    },
    setMapSelectProvinceName(state: MapInfo, { payload }: { payload: MapInfo['mapSelect']['provinceName'] }) {
      state.mapSelect.provinceName = payload;
    },
  },
});
export const { setMapSelect, setMapSelectTopic, setMapSelectAreaCode, setMapSelectProvinceName } = mapResourceSlice.actions;
export const reduxMapResourceReducer = mapResourceSlice.reducer;
