"use client"
import { useState, useEffect } from "react"

import { backendApiEndpointDeliverer } from "./backendApiEndpointDeliverer"

export async function profileDataClient(
  handle,
  linkPosition = null,
  contentBoxPosition = null,
  method,
  body = null
) {
  const baseURL = "http://localhost:5678"

  if (contentBoxPosition === null) {
    return await getMainProfileData(handle, method)
  }

  // use data client for a specific content box
  switch (contentBoxPosition) {
    case 0:
      if (method === "GET") {
        return await getLinkCollection(handle, method)
      } else if (method === "PUT") {
        return await updateLinkWithinCollection(
          handle,
          contentBoxPosition,
          method,
          body
        )
      } else if (method === "POST") {
        return await addLinkToCollection(handle, method, body)
      } else if (method === "DELETE") {
        if (linkPosition === null) {
          throw new Error("linkPosition is required for DELETE method.")
        }
        return await deleteLinkWithinCollection(
          handle,
          linkPosition,
          contentBoxPosition,
          method
        )
      }
      break

    case 1:
      return await getFeaturedContent(handle, method)

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

  async function addLinkToCollection(handle, method, body) {
    const endpoint = `${baseurl}/linkCollection/link?handle=${handle}&position=${contentBoxPosition}`

    const config = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    const endpoint = `${baseURL}/api/v1/linkCollection?handle=${handle}`

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

  async function updateLinkWithinCollection(
    handle,
    contentBoxPosition,
    method,
    body
  ) {
    const endpoint = `${baseURL}/api/v1/linkCollection/update?handle=${handle}&contentBoxPosition=${contentBoxPosition}`

    const config = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

  async function deleteLinkWithinCollection(
    handle,
    linkPosition,
    contentBoxPosition,
    method
  ) {
    let endpoint = `${baseurl}/linkCollection/link?handle=${handle}&position=${linkPosition}`

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
