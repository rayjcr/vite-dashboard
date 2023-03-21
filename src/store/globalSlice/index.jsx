import { createSlice } from '@reduxjs/toolkit'
import { getGlobalState, getLocale } from '@/utils/tool.js'

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    global: {
      ...getGlobalState(),
      locale: getLocale(),
    }
  },
  reducers: {
    setGlobal: (state, action) => {
      return {...state, ...action.payload}
    }
  }
})

export const { setGlobal } =  globalSlice.actions;

export default globalSlice.reducer;


