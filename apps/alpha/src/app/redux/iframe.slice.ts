import { createSlice } from '@reduxjs/toolkit';
import { stat } from 'fs';
export const REDUX_IFRAME_RESOURCE_KEY = 'reduxIframeResource';
export interface IframeInfo {
  url: string;
  title: string;
  ifShow?: boolean;
  backText?: string;
  iframeStyle?: object;
}

export const iframeResourceSlice = createSlice({
  name: REDUX_IFRAME_RESOURCE_KEY,
  initialState: {
    ifShow: false,
    url: '',
    title: '',
    backText: '',
  } as IframeInfo,
  reducers: {
    setIframeShow(state: IframeInfo, { payload }: { payload: IframeInfo }) {
      state.url = payload.url;
      state.title = payload.title;
      if (payload.backText) {
        state.backText = payload.backText;
      }
      if (payload.iframeStyle) {
        state.iframeStyle = payload.iframeStyle;
      }
      state.ifShow = true;
    },
    setIframeHide(state: IframeInfo) {
      state.ifShow = false;
    },
  },
});
export const { setIframeShow, setIframeHide } = iframeResourceSlice.actions;
export const reduxIframeResourceReducer = iframeResourceSlice.reducer;
