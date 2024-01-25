"use client"

import { useContext } from "react"
import { ProfileContext } from "../ProfileProvider"
import { IconMapper } from "../../../components/iconMapper"

export default function Page() {
  return <Featured />
}

function Featured() {
  const profile = useContext(ProfileContext)
  const { featuredContentData } = profile
  const featuredContent = featuredContentData

  console.log("featuredContent.contentBox=")
  console.table(featuredContent.contentBox)
  console.log("featuredContent")
  console.log(featuredContent)

  let title = featuredContent.shortTitle
  const innerHTML = featuredContent.contentBox.map((contentBox) => {
    return (
      <div className="space-y-6" key={"cb-" + contentBox.position}>
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          <div className="space-y-6">
            <div key={contentBox.category + contentBox.position}>
              <a href={contentBox.url}>
                <IconMapper url={contentBox.url} />
                <b>
                  <span className="mx-2">
                    {contentBox.title.length > 0 ? contentBox.title : ""}
                  </span>
                </b>
              </a>
              <br />
              <span>
                {contentBox.description.length > 0
                  ? contentBox.description
                  : contentBox.url}
              </span>
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    )
  }, [])
  return (
    <div className="bg-early-spring-night">
      <b>{title}</b>
      {innerHTML}
    </div>
  )
}
