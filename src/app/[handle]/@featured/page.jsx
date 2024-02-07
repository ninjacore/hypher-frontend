"use client"

import { useContext } from "react"
import { ProfileContext } from "../ProfileProvider"
import { IconMapper } from "../../../components/iconMapper"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Page() {
  return <Featured />
}

function Featured() {
  const profile = useContext(ProfileContext)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  const { featuredContentData } = profile
  const featuredContent = featuredContentData

  console.log("featuredContent.contentBox=")
  console.table(featuredContent.contentBox)
  console.log("featuredContent")
  console.log(featuredContent)

  let title = featuredContent.shortTitle
  const innerHTML = featuredContent.contentBox.map((contentBox) => {
    return (
      <Card key={contentBox.category + contentBox.position} className="my-4">
        <a href={contentBox.url} target="_blank">
          <div className="flex">
            <div className="text-5xl py-4 px-2">
              <IconMapper url={contentBox.category + ":"} />
            </div>
            <div className="grow p-2">
              <span>{contentBox.title.length > 0 ? contentBox.title : ""}</span>
              <br />
              <span>
                {contentBox.description.length > 0
                  ? contentBox.description
                  : contentBox.url}
              </span>
            </div>
          </div>
        </a>
      </Card>
    )
  }, [])
  return (
    <>
      <b>{title}</b>
      <div className="">{innerHTML}</div>
    </>
  )
}
