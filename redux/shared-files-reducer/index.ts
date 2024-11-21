import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SharedFilesState {
  files: any[];
}

const initialState: SharedFilesState = {
  files: [],
};

const sharedFilesSlice = createSlice({
  name: "sharedFiles",
  initialState,
  reducers: {
    setSharedFiles: (state, action: PayloadAction<any[]>) => {
      state.files = action.payload;
    },
  },
});

export const { setSharedFiles } = sharedFilesSlice.actions;
export default sharedFilesSlice.reducer;
