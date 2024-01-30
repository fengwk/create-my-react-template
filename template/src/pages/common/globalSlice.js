import { createSlice } from '@reduxjs/toolkit';
import { getDefaultLocaleName } from '../../utils';

export default createSlice({
  name: 'global',
  initialState: {
    localeName: getDefaultLocaleName(),
    themeName: 'light',
  },
  reducers: {
    setLocaleName: (state, { payload }) => {
      state.localeName = payload;
      return state;
    },
    setThemeName: (state, { payload }) => {
      state.themeName = payload;
      return state;
    },
  },
});
