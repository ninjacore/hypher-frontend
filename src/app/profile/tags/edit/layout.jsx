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
      <div>{children}</div>
    </div>
  )
}
