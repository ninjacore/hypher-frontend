import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSingleLineHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Layout({ children }) {
  return (
    <div className="mx-10 px-4 border">
      <div className="flex justify-between my-4">
        <h1 className="text-3xl font-bold mx-1">Tags</h1>
      </div>
      <div>{children}</div>
    </div>
  )
}
