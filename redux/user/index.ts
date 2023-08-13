/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
  data: any;
  token: string;
  user: string;
  selectedLanguage: string;
  storedEnviromentsUrl: any;
}

const initialState: UserState = {
  data: undefined,
  token: undefined,
  user: undefined, // username
  selectedLanguage: undefined,
  storedEnviromentsUrl: undefined
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: () => initialState,
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload.data;
    },
    setToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload.token;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user;
    },
    setLanguage: (state, action: PayloadAction<any>) => {
      state.selectedLanguage = action.payload.selectedLanguage;
    },
    setStoredEnviromentsUrl: (state, action: PayloadAction<any>) => {
      state.storedEnviromentsUrl = action.payload.storedEnviromentsUrl;
    }
  }
});

export const {
  login,
  logout,
  setLanguage,
  setData,
  setToken,
  setUser,
  setStoredEnviromentsUrl
} = userSlice.actions;

export const selectData = (state: RootState) => state.user.data;
export const selectUser = (state: RootState) => state.user.user;
export const selectToken = (state: RootState) => state.user.token;
export const selectSelectedLanguage = (state: RootState) =>
  state.user.selectedLanguage;
export const selectStoredEnviromentsUrl = (state: RootState) =>
  state.user.storedEnviromentsUrl;

export default userSlice.reducer;
