import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {TTheme} from '../../theme';

interface SliceState {
  appState: {
    theme: TTheme;
    firstTime: boolean;
  };
}

const initialState = {
  theme: 'light',
  firstTime: true,
};

const authSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFirstTime: (state, action: PayloadAction<{status: boolean}>) => {
      state.firstTime = action.payload.status;
    },
  },
});

export const {setTheme, setFirstTime} = authSlice.actions;

export const selectTheme = (state: SliceState) => state.appState.theme;

export const selectFirstTime = (state: SliceState) => state.appState.firstTime;

export default authSlice.reducer;
