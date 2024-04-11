"use client"
import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store"

// data store slices
import aboutReducers from "@/lib/v1-legacy/features/profile/aboutSlice"
import { setAbout } from "@/lib/v1-legacy/features/profile/aboutSlice"

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()

    // for debugging reset of the store & loss of initial states
    // let colorCode = "#da70d6" // orchid
    // console.log(`%c /////////////////`, `color: ${colorCode}; font-size: 20px;`)
    // console.log(
    //   `%c —storeRef.current—`,
    //   `color: ${colorCode}; font-size: 20px;`
    // )
    // console.log(`%c ${storeRef.current.getState}`, `color: ${colorCode};`)
    // console.table(storeRef.current)

    // Preload the store with data
    // storeRef.current.dispatch(setAbout({ id: 1, about: "Loading...2" }))
    // storeRef.current.dispatch(setAbout({ id: 2, about: "Unloading.." }))

    // storeRef.current.dispatch(aboutReducers.actions.setAbout({id: 0, about: "Loading...2"}))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
