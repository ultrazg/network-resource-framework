import { createSlice } from '@reduxjs/toolkit';

interface targetObj {
  continent: string;
  chooseContinent: string;
}

function initState() {
  return '';
}

export const REDUX_CONTINENT_KEY = 'reduxContinent';

export const continentSlice = createSlice({
  name: REDUX_CONTINENT_KEY, // 命名空间，在调用action的时候会默认的设置为action的前缀
  // 初始值
  initialState: {
    continent: initState(),
    chooseContinent: '',
  } as targetObj,
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    setContinent(state: targetObj, { payload }: any) {
      state.continent = payload;
    },

    resetContinent(state: targetObj) {
      state.continent = '';
    },

    setChooseContinent(state: targetObj, { payload }: any) {
      state.chooseContinent = payload;
    },

    resetChooseContinent(state: targetObj) {
      state.chooseContinent = '';
    },
  },
});

export const {
  setContinent,
  resetContinent,
  setChooseContinent,
  resetChooseContinent,
} = continentSlice.actions;

export const reduxContinentReducer = continentSlice.reducer;
