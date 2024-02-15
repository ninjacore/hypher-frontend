import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSingleLineHeader,
  CardTitle,
} from "@/components/ui/card"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faPenToSquare } from "@fortawesome/free-solid-svg-icons"

const title = "Profile Page"

// to be handled by token
const pageOwner = true

// to be handley by button click
const editMode = true

export const metadata = {
  title,
  openGraph: {
    title,
    images: [`/api/og?title=${title}`],
  },
}

function ProfilePageButton({ isOwner }) {
  if (isOwner) {
    return (
      <Button variant="outline" className="bg-white text-black">
        {"edit"}
      </Button>
    )
  }

  return (
    <Button variant="outline" className="bg-white text-black">
      {"connect"}
    </Button>
  )
}

function EditButton() {
  return (
    <Button
      // variant="default"
      className="group-hover/edit:bg-accent group-hover/edit:text-accent-foreground text-black rounded p-0.5"
    >
      <FontAwesomeIcon
        icon={faPenToSquare}
        className="fas fa-pen-to-square text-xs px-1.5 my-auto my-2.45 ml-1 py-0"
      ></FontAwesomeIcon>
    </Button>
  )
}

export default function Layout({
  name,
  about,
  tags,
  linkCollection,
  featured,
}) {
  // edit mode
  if (editMode) {
    return (
      <>
        <Card className="mb-2">
          <CardSingleLineHeader className="flex justify-between my-4">
            <h1 className="text-3xl font-bold mx-1">{name}</h1>
          </CardSingleLineHeader>
          <CardContent>
            <div className="px-1 py-2 group/edit">
              {about}
              <EditButton />
            </div>

            <div className="mt-2 px-1">
              <hr className="border-gray-400 border-t-2" />
            </div>
            <div className="mt-2 group/edit">
              {tags}
              <EditButton />
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent>{linkCollection}</CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent>{featured}</CardContent>
        </Card>
      </>
    )
  }

  // view mode
  return (
    <>
      <Card className="mb-2">
        <CardSingleLineHeader className="flex justify-between my-4">
          <h1 className="text-3xl font-bold mx-1">{name}</h1>
          <ProfilePageButton isOwner={pageOwner} />
        </CardSingleLineHeader>
        <CardContent>
          <div className="px-1 py-2">{about}</div>
          <div className="mt-2 px-1">
            <hr className="border-gray-400 border-t-2" />
          </div>
          <div className="mt-2">{tags}</div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>{linkCollection}</CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>{featured}</CardContent>
      </Card>
    </>
  )
}
