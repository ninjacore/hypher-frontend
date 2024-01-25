"use client"

import { useContext } from "react"
import { ProfileContext } from "../ProfileProvider"
import { IconMapper } from "../../../components/iconMapper"

export default function Page() {
  return <LinkCollection />
}

function LinkCollection() {
  const profile = useContext(ProfileContext)
  const { linkedCollectionData } = profile
  const linkedCollection = linkedCollectionData

  console.log("linkedCollection.contentBox=")
  console.table(linkedCollection.contentBox)

  const innerHTML = linkedCollection.contentBox.map((link) => {
    return (
      <div
        key={"pos-" + link.position}
        className="my-4 mx-2 py-2 px-3 bg-konkikyou-blue"
      >
        <a href={link.url}>
          <IconMapper url={link.url} />
          <span className="mx-2">
            {link.text.length > 0 ? link.text : link.url}
          </span>
        </a>
      </div>
    )
  }, [])
  return (
    <>
      <b>LET'S CONNECT</b>
      <>{innerHTML}</>
    </>
  )
}
