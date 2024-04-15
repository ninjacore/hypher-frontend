"use client"
import { useState, useEffect } from "react"

import { backendApiEndpointDeliverer } from "./backendApiEndpointDeliverer"

export async function profileDataClient(
  handle,
  contentBoxPosition = null,
  method,
  body = null
) {
  if (contentBoxPosition === null) {
    return await getMainProfileData(handle, method)
  }

  // use data client for a specific content box
  switch (contentBoxPosition) {
    case 0:
      return await getFeaturedContent(handle, method)

    case 1:
      return await getLinkCollection(handle, method)

    default:
      throw new Error("ContentBox out of scope.")
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

  async function getMainProfileData(handle, method) {
    const endpoint = backendApiEndpointDeliverer(
      "mainProfilePageData",
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

  async function getFeaturedContent(handle, method) {
    const endpoint = backendApiEndpointDeliverer(
      "featuredContent",
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

  async function getLinkCollection(handle, method) {
    const endpoint = backendApiEndpointDeliverer(
      "linkCollection",
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
