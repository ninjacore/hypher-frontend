"use client"
import { useState, useEffect } from "react"

import { backendApiEndpointDeliverer } from "./backendApiEndpointDeliverer"

export async function profileDataClient(
  handle,
  contentBoxPosition = null,
  method,
  body = null
) {
  if (contentBoxPosition !== null) {
    // use data client for a specific content box
  }

  switch (method) {
    case "GET":
      return await getProfileData(handle, method)
    // case "POST":
    //   return await postProfileData(handle, method, body)
    // case "PUT":
    //   return await putProfileData(handle, method, body)
    // case "DELETE":
    //   return await deleteProfileData(handle, method)
    default:
      throw new Error("Method not supported")
  }

  // client functions /.
  async function getAllProfileData(handle, method) {
    const endpoint = backendApiEndpointDeliverer(
      "profilePageData",
      method,
      handle
    )

    const config = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    let data = null

    try {
      const response = await window.fetch(endpoint, config)
      data = await response.json()
      if (response.ok) {
        return {
          status: response.status,
          data,
          headers: response.headers,
          url: response.url,
        }
      }
      // if not ok..
      throw new Error(response.statusText)
    } catch (error) {
      return Promise.reject(error.message ? error.message : data)
    }
  }
  // client functions ./
}
