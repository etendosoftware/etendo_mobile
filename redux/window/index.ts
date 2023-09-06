/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface WindowState {
  appsData: any[];
  bindaryImg: string;
  error: any;
  loading: boolean;
  loadingScreen: boolean;
  logged: boolean;
  menuItems: any[];
  windows: any[];
  isDemo: boolean;
  isSubapp: boolean;
}

const initialState: WindowState = {
  appsData: [],
  bindaryImg: "",
  error: null,
  isDemo: false,
  isSubapp: false,
  loading: false,
  loadingScreen: true,
  logged: false,
  menuItems: [],
  windows: []
};

export const windowSlice = createSlice({
  name: "window",
  initialState,
  reducers: {
    setAppData: (state, action: PayloadAction<any>) => {
      state.appsData = action.payload;
    },
    setBindaryImg: (state, action: PayloadAction<any>) => {
      state.bindaryImg = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    setIsDemo: (state, action: PayloadAction<any>) => {
      state.isDemo = action.payload;
    },
    setIsSubapp: (state, action: PayloadAction<any>) => {
      state.isSubapp = action.payload;
    },
    setLoading: (state, action: PayloadAction<any>) => {
      state.loading = action.payload;
    },
    setLoadingScreen: (state, action: PayloadAction<any>) => {
      state.loadingScreen = action.payload;
    },
    setLogged: (state, action: PayloadAction<any>) => {
      state.logged = action.payload;
    },
    setMenuItems: (state, action: PayloadAction<any>) => {
      state.menuItems = action.payload;
    },
    setWindows: (state, action: PayloadAction<any>) => {
      state.windows = action.payload;
    }
  }
});

export const {
  setAppData,
  setBindaryImg,
  setError,
  setIsDemo,
  setIsSubapp,
  setLoading,
  setLoadingScreen,
  setLogged,
  setMenuItems,
  setWindows
} = windowSlice.actions;

export const selectAppData = (state: RootState) => state.window.appsData;
export const selectBinaryImg = (state: RootState) => state.window.bindaryImg;
export const selectError = (state: RootState) => state.window.error;
export const selectIsDemo = (state: RootState) => state.window.isDemo;
export const selectIsSubapp = (state: RootState) => state.window.isSubapp;
export const selectLoading = (state: RootState) => state.window.loading;
export const selectLoadingScreen = (state: RootState) =>
  state.window.loadingScreen;
export const selectLogged = (state: RootState) => state.window.logged;
export const selectMenuItems = (state: RootState) => state.window.menuItems;
export const selectWindows = (state: RootState) => state.window.windows;

export default windowSlice.reducer;
