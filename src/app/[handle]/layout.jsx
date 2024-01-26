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

export const metadata = {
  title,
  openGraph: {
    title,
    images: [`/api/og?title=${title}`],
  },
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
          <Button variant="outline" className="bg-white text-black">
            connect
          </Button>
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
