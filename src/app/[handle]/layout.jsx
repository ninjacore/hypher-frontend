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

const title = "Parallel Routes"

// to be handled by token
const pageOwner = true

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

export default function Layout({
  name,
  about,
  tags,
  linkCollection,
  featured,
}) {
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
