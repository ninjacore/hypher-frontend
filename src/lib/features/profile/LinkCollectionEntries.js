import React from "react"

// to read data from the Redux store
import { useSelector } from "react-redux"

export const LinkCollectionEntries = () => {
  // useSelector is a hook that allows you to extract data from the Redux store state
  const links = useSelector((state) => state.linkCollection.links)

  return (
    <>
      <h2>Links via Redux</h2>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url}>{link.name}</a>
          </li>
        ))}
      </ul>
    </>
  )
}
