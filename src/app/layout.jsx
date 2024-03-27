import { Inter } from "next/font/google"
import "./globals.css"

// shadcn
import { cn } from "../lib/utils"

import StoreProvider from "./StoreProvider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto px-4">
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              TOP BAR - to be navigation
            </div>
          </div>
          <StoreProvider>{children}</StoreProvider>
        </div>
      </body>
    </html>
  )
}
