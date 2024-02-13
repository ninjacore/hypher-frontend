import { createContext, useContext, useState } from "react"

const Context = createContext(1)

function Wrapper({ children }) {
  const [count, setCount] = useState(1)

  return (
    <>
      <Context.Provider value={count}>
        <NestedComponent />
      </Context.Provider>
    </>
  )
}

// otherwise undefined for other components
export { Context }
