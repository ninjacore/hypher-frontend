"use client"
import { useState, useEffect } from "react"

// async function linkCollectionDataClient(handle) {
//   // to make sure state is updated once we get the data pt.1
//   const [data, setData] = useState(null)
//   const [loaded, setLoaded] = useState(false)

//   const apiUrl = `http://localhost:5678/api/v1/linkCollections/byHandle/${handle}`

//   // to make sure state is updated once we get the data pt.2
//   await fetch(apiUrl).then((response) =>
//     response
//       .json()
//       .then((data) => ({
//         data: data,
//         status: response.status,
//       }))
//       .then((res) => {
//         console.log("decodedResponse=", res)
//         // only load if there's data
//         if (res.data) {
//           // split profile data to make it usable
//           let splitData = splitProfileData(res.data)
//           console.log("splitData=")
//           console.log(splitData)
//           setData(splitData)
//           setLoaded(true)
//         }
//       })
//   )

//   return data
// }
// export default linkCollectionDataClient

export async function client(endpoint, { body, ...customConfig } = {}) {
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

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" })
}

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}
