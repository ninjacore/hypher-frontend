"use client"
import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "../lib/store"

// data store slices
import aboutReducers from "../lib/features/profile/aboutSlice"
import { setAbout } from "../lib/features/profile/aboutSlice"

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()

    // Preload the store with data
    storeRef.current.dispatch(setAbout({ id: 0, about: "Loading...2" }))
    // storeRef.current.dispatch(aboutReducers.actions.setAbout({id: 0, about: "Loading...2"}))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
