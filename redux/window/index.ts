/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface WindowState {
  loading: boolean;
  error: any;
  windows: any[];
  menuItems: any[];
}

const initialState: WindowState = {
  loading: false,
  error: null,
  windows: [],
  menuItems: []
};

export const windowSlice = createSlice({
  name: "window",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    setWindows: (state, action: PayloadAction<any>) => {
      state.windows = action.payload;
    },
    setMenuItems: (state, action: PayloadAction<any>) => {
      state.menuItems = action.payload;
    }
  }
});

export const {
  setLoading,
  setError,
  setWindows,
  setMenuItems
} = windowSlice.actions;

export const selectLoading = (state: RootState) => state.window.loading;
export const selectError = (state: RootState) => state.window.error;
export const selectWindows = (state: RootState) => state.window.windows;
export const selectMenuItems = (state: RootState) => state.window.menuItems;

export default windowSlice.reducer;
