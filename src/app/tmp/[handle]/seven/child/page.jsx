"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

import { ProfileContext, ValueOfInterest } from "../page"

export default function Page() {
  return (
    <ValueOfInterest>
      <CoolKid />
    </ValueOfInterest>
  )
}

function CoolKid() {
  // using value from React Context API
  const value = useContext(ProfileContext)

  return <p>{value}</p>
}
