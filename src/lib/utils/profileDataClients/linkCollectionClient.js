import { announce } from "../debugTools/announce"

import { apiHandler } from "../apiHandler"
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

// client functions for LinkCollection /.
async function createLinkCollection(handle, method, body) {
  const endpoint = `${baseURL}/api/v2/linkCollection?handle=${handle}`

  return await apiHandler(endpoint, method, body)
}

async function getLinkCollection(handle, contentBoxPosition, method) {
  const endpoint = `${baseURL}/api/v2/linkCollection?handle=${handle}`

  return await apiHandler(endpoint, method)
}

async function updateLinkCollection(handle, contentBoxPosition, body) {
  const endpoint = `${baseURL}/api/v2/linkCollection/update?handle=${handle}`
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
  const endpoint = `${baseURL}/api/v2/linkCollection/link?handle=${handle}`

  return await apiHandler(endpoint, method, body)
}

async function updateLinkWithinCollection(
  handle,
  contentBoxPosition,
  method,
  body
) {
  const endpoint = `${baseURL}/api/v2/linkCollection/link/update?handle=${handle}`

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
