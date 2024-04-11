import { configureStore } from "@reduxjs/toolkit"

import aboutReducers from "../v1-legacy/features/profile/aboutSlice"
import linkCollectionReducers from "../v1-legacy/features/profile/linkCollectionSlice"

// create a store instance per-request to avoid state conflicts
export const makeStore = () => {
  return configureStore({
    reducer: {
      about: aboutReducers,
      linkCollection: linkCollectionReducers,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
