"use client"

import { useContext } from "react"
import { ProfileContext, Profile } from "../page.jsx"
import { IconMapper } from "../../../components/iconMapper"

import { EditButton } from "@/components/ui/editButtonPen"

export default function Page() {
  return (
    <Profile>
      <EditableLinkCollection />
    </Profile>
  )
}

function EditableLinkCollection() {
  const sectionTitle = "LET'S CONNECT"

  const profile = useContext(ProfileContext)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  const { linkCollectionData } = profile
  const linkedCollection = linkCollectionData

  console.log("linkedCollection.contentBox=")
  console.table(linkedCollection.contentBox)

  const innerHTML = linkedCollection.contentBox.map((link) => {
    return (
      <>
        <div
          key={"pos-" + link.position + "-editable"}
          className="my-4 mx-2 py-2 px-3 bg-konkikyou-blue group/edit"
        >
          <a>
            <IconMapper url={link.url} />
            <span className="mx-2">
              {link.text.length > 0 ? link.text : link.url}
            </span>
          </a>
          <EditButton />
        </div>
      </>
    )
  }, [])
  return (
    <>
      <b>{sectionTitle}</b>
      <>{innerHTML}</>
    </>
  )
}
