// src/redux/slices/codeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codeMap: {} // { problemId: code }
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    updateCode: (state, action) => {
      const { problemId, code } = action.payload;
      state.codeMap[problemId] = code;
    },
    clearCode: (state, action) => {
      const { problemId } = action.payload;
      delete state.codeMap[problemId];
    },
  },
});

export const { updateCode, clearCode } = codeSlice.actions;
export default codeSlice.reducer;
