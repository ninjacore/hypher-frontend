"use client"
import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store"

// data store slices
import aboutReducers from "@/lib/legacy/v1/features/profile/aboutSlice"
import { setAbout } from "@/lib/legacy/v1/features/profile/aboutSlice"

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
