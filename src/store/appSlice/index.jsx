import { createSlice } from '@reduxjs/toolkit'
import { getGlobalState, getLocale } from '@/utils/tool.js'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: {
      menuList: [],
      username: '',
      role: '',
      avatar: '',
    }
  },
  reducers: {
    setState: (state, action) => {
      return {...state, ...action.payload}
    }
  }
})

export const { setState } =  appSlice.actions;

export default appSlice.reducer;





