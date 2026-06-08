import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTemplate: null,
  templates: [],
  loading: false
};

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    clearSelectedTemplate: (state) => {
      state.selectedTemplate = null;
    }
  }
});

export const { setSelectedTemplate, setTemplates, clearSelectedTemplate } = templateSlice.actions;
export default templateSlice.reducer;