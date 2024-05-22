import { configureStore } from "@reduxjs/toolkit"

import linkCollectionReducers from "@/lib/features/profilePage/linkCollectionSlice"
import featuredContentReducers from "@/lib/features/profilePage/featuredContentSlice"

// create a store instance per-request to avoid state conflicts
export const makeStore = () => {
  return configureStore({
    reducer: {
      linkCollection: linkCollectionReducers,
      featuredContent: featuredContentReducers,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
