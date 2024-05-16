import { create } from "domain"
import { announce } from "../debugTools/announce"

const baseURL = "http://localhost:5678"

export async function linkCollectionClient(
  handle,
  contentType = "linkCollection",
  method = "GET",
  body = null,
  linkPosition = null,
  contentBoxPosition = 0,
  frontendId = null
) {
  // 'CRUD' style
  switch (contentType) {
    case "linkCollection":
      if (method === "POST") {
        return await createLinkCollection(handle, method, body) // required body: List<LinkWithinCollection>
      } else if (method === "GET") {
        return await getLinkCollection(handle, contentBoxPosition, method)
      } else if (method === "PUT") {
        return await updateLinkCollection(handle, contentBoxPosition, body) // required body: List<LinkWithinCollection>
      } else if (method === "DELETE") {
        // TODO: return await deleteLinkCollection()
      }
      break

    case "link":
      if (method === "POST") {
        return await addLinkToCollection(
          handle,
          contentBoxPosition,
          method,
          body
        )
      } else if (method === "GET") {
        throw new Error(
          "GET method is not supported for a single link. Ask for the whole link collection instead."
        )
      } else if (method === "PUT") {
        return await updateLinkWithinCollection(
          handle,
          contentBoxPosition,
          method,
          body
        )
      } else if (method === "DELETE") {
        if (frontendId === null) {
          throw new Error("frontendId is required for DELETE method.")
        }
        return await deleteLinkWithinCollection(
          handle,
          frontendId,
          contentBoxPosition,
          method
        )
      }
      break

    default:
      return await getLinkCollection(handle, contentBoxPosition, method)
  }
}

async function apiHandler(endpoint, method, body = null) {
  const config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  // anything but 'GET' and 'DELETE' usually has a body
  if (body) {
    config.body = JSON.stringify(body)
  } else if (method === "PUT" || method === "POST") {
    throw new Error("Body is required for ADD or UPATE.")
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
    // temp for mobile debugging
    document.getElementById("mobileMessageOutput").innerHTML = JSON.stringify(
      error.message ? error.message : data
    )

    return Promise.reject(error.message ? error.message : data)
  }
}

// client functions for LinkCollection /.
async function createLinkCollection(handle, method, body) {
  const endpoint = `${baseURL}/api/v2/linkCollection?handle=${handle}&contentBoxPosition=${contentBoxPosition}`

  return await apiHandler(endpoint, method, body)
}

async function getLinkCollection(handle, contentBoxPosition, method) {
  const endpoint = `${baseURL}/api/v2/linkCollection?handle=${handle}&contentBoxPosition=${contentBoxPosition}`

  return await apiHandler(endpoint, method)
}

async function updateLinkCollection(handle, contentBoxPosition, body) {
  const endpoint = `${baseURL}/api/v2/linkCollection/update?handle=${handle}&contentBoxPosition=${contentBoxPosition}`
  if (!body) {
    throw new Error("Body is required for update.")
  } else {
    console.log("body: ", body)
  }
  return await apiHandler(endpoint, "PUT", body)
}
// client functions for LinkCollection /.

// client functions for Link /.
async function addLinkToCollection(handle, contentBoxPosition, method, body) {
  const endpoint = `${baseURL}/api/v2/linkCollection/link?handle=${handle}&contentBoxPosition=${contentBoxPosition}`

  return await apiHandler(endpoint, method, body)
}

async function updateLinkWithinCollection(
  handle,
  contentBoxPosition,
  method,
  body
) {
  const endpoint = `${baseURL}/api/v2/linkCollection/link/update?handle=${handle}&contentBoxPosition=${contentBoxPosition}`

  return await apiHandler(endpoint, method, body)
}

async function deleteLinkWithinCollection(
  handle,
  frontendId,
  contentBoxPosition = 0,
  method
) {
  announce("deleteLinkWithinCollection", {
    handle,
    frontendId,
    contentBoxPosition,
    method,
  })

  // atm only contentBoxPosition of 0 is supported
  let endpoint = `${baseURL}/api/v2/linkCollection/link/delete?handle=${handle}&frontendId=${frontendId}`

  return await apiHandler(endpoint, method)
}

// client functions for Link ./
