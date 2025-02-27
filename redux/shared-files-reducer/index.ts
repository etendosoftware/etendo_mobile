import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SharedFile {
  filePath: string;
  fileName: string;
  fileMimeType: string;
}

interface SharedFilesState {
  files: SharedFile[];
}

const initialState: SharedFilesState = {
  files: [],
};

const sharedFilesSlice = createSlice({
  name: "sharedFiles",
  initialState,
  reducers: {
    setSharedFiles: (state, action: PayloadAction<SharedFile[]>) => {
      console.info("setSharedFiles called with:", action.payload);
      state.files = action.payload;
    },
  },
});

export const { setSharedFiles } = sharedFilesSlice.actions;
export default sharedFilesSlice.reducer;
