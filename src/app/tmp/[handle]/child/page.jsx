"use client"
import { useContext } from "react"
import { Context } from "./wrapper.jsx"

export default function Page() {
  return <NestedComponent />
}

function NestedComponent() {
  const contextValue = useContext(Context)

  return <p>{contextValue}</p>
}
