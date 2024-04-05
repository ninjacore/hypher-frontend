"use client"
import { useState, useEffect } from "react"

export async function linkCollectionDataClient(
  handle,
  contentBoxPosition,
  method,
  body
) {
  // to make sure state is updated once we get the data pt.1
  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [serverResponse, setServerResponse] = useState(null)

  console.log(
    `%c starting fetch for ${handle}`,
    "color: green; font-size: 1.2em; font-weight: bold;"
  )

  const apiUrl = `http://localhost:5678/api/v1/linkCollections/byHandle/${handle}?contentBoxPosition=${contentBoxPosition}`

  // to make sure state is updated once we get the data pt.2
  try {
    await fetch(apiUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) =>
      response
        .json()
        .then((data) => ({
          data: data,
          status: response.status,
        }))
        .then((res) => {
          if (res.data) {
            // // split profile data to make it usable
            // let splitData = splitProfileData(res.data)
            // console.log("splitData=")
            // console.log(splitData)
            console.log(
              `%c response status: ${res.status}`,
              "color: blue; font-size: 1.2em; font-weight: bold;"
            )
            console.log(
              `%c response data: ${JSON.stringify(res.data)}`,
              "color: blue; font-size: 1.2em; font-weight: bold;"
            )

            // setData(res.data)
            setServerResponse(res)
            setLoaded(true)
          }
        })
    )
  } catch (error) {
    console.log(
      `%c ERROR IN HTTP REQUEST: ${error}`,
      "color: red; font-size: 1.2em; font-weight: bold;"
    )
  }

  return serverResponse
}

export async function putClient(endpoint, { body, ...customConfig } = {}) {
  const headers = { "Content-Type": "application/json" }

  const config = {
    // method: body ? "POST" : "GET",
    method: customConfig.method || "PUT",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = body //JSON.stringify(body)
  }

  let data

  // endpoint = "http://localhost:5678/api/v1/linkCollections/byHandle/dnt.is"

  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(response.statusText)
  } catch (err) {
    return Promise.reject(err.message ? err.message : data)
  }
}

putClient.get = function (endpoint, customConfig = {}) {
  return putClient(endpoint, { ...customConfig, method: "GET" })
}

putClient.post = function (endpoint, body, customConfig = {}) {
  return putClient(endpoint, { ...customConfig, body })
}

export async function getOrPostClient(
  endpoint,
  { body, ...customConfig } = {}
) {
  const headers = { "Content-Type": "application/json" }

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data

  endpoint = "http://localhost:5678/api/v1/linkCollections/byHandle/dnt.is"

  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(response.statusText)
  } catch (err) {
    return Promise.reject(err.message ? err.message : data)
  }
}

getOrPostClient.get = function (endpoint, customConfig = {}) {
  return getOrPostClient(endpoint, { ...customConfig, method: "GET" })
}

getOrPostClient.post = function (endpoint, body, customConfig = {}) {
  return getOrPostClient(endpoint, { ...customConfig, body })
}
