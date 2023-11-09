/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IData, ILanguage } from "../../src/interfaces";

export interface UserState {
  data: IData;
  bindaryImg: any;
  contextPath: string;
  token: string;
  user: string;
  selectedLanguage: string;
  devUrl: string;
  selectedUrl: string;
  selectedEnvironmentUrl: string;
  storedLanguages: ILanguage[];
  storedEnviromentsUrl: string[];
}

const initialState: UserState = {
  data: undefined,
  bindaryImg: undefined,
  contextPath: "/etendo",
  token: undefined,
  user: undefined, // username
  selectedLanguage: undefined,
  devUrl: undefined,
  selectedEnvironmentUrl: undefined,
  selectedUrl: undefined,
  storedLanguages: [],
  storedEnviromentsUrl: []
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setBindaryImg: (state, action: PayloadAction<any>) => {
      state.bindaryImg = action.payload;
    },
    setContextPath: (state, action: PayloadAction<any>) => {
      state.contextPath = action.payload;
    },
    setToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setLanguage: (state, action: PayloadAction<any>) => {
      state.selectedLanguage = action.payload;
    },
    setDevUrl: (state, action: PayloadAction<any>) => {
      state.devUrl = action.payload;
    },
    setSelectedEnvironmentUrl: (state, action: PayloadAction<any>) => {
      state.selectedEnvironmentUrl = action.payload;
    },
    setSelectedUrl: (state, action: PayloadAction<any>) => {
      state.selectedUrl = action.payload;
    },
    setStoredLanguages: (state, action: PayloadAction<any>) => {
      state.storedLanguages = action.payload;
    },
    setStoredEnviromentsUrl: (state, action: PayloadAction<any>) => {
      state.storedEnviromentsUrl = action.payload;
    }
  }
});

export const {
  setData,
  setBindaryImg,
  setContextPath,
  setToken,
  setUser,
  setLanguage,
  setDevUrl,
  setSelectedEnvironmentUrl,
  setSelectedUrl,
  setStoredLanguages,
  setStoredEnviromentsUrl
} = userSlice.actions;

export const selectContextPath = (state: RootState) => state.user.contextPath;
export const selectData = (state: RootState) => state.user.data;
export const selectBindaryImg = (state: RootState) => state.user.bindaryImg;
export const selectUser = (state: RootState) => state.user.user;
export const selectToken = (state: RootState) => state.user.token;
export const selectSelectedEnvironmentUrl = (state: RootState) =>
  state.user.selectedEnvironmentUrl;
export const selectSelectedUrl = (state: RootState) => state.user.selectedUrl;
export const selectSelectedLanguage = (state: RootState) =>
  state.user.selectedLanguage;
export const selectDevUrl = (state: RootState) => state.user.devUrl;
export const selectStoredEnviromentsUrl = (state: RootState) =>
  state.user.storedEnviromentsUrl;
export const selectStoredLanguages = (state: RootState) =>
  state.user.storedLanguages;

export default userSlice.reducer;
