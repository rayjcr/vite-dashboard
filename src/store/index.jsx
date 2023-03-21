import { configureStore } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import globalReducer from './globalSlice'

export default configureStore({
  reducer: {
    app: appReducer,
    global: globalReducer
  }
})