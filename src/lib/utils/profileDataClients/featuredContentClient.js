import { announce } from "../debugTools/announce"
import { apiHandler } from "../apiHandler"

const baseURL = "http://localhost:5678"

// client functions for full FeaturedContent /.
export async function getFeaturedContent(handle) {
  //   const endpoint = `${baseURL}/api/v1/featuredContent?handle=${handle}&contentBoxPosition=${contentBoxPosition}`
  const endpoint = `${baseURL}/api/v2/featuredContent?handle=${handle}`

  return await apiHandler(endpoint, "GET")
}

export async function updateFeaturedContent(handle, dataUpdates) {
  const endpoint = `${baseURL}/api/v2/featuredContent/update?handle=${handle}`

  return await apiHandler(endpoint, "PUT", dataUpdates)
}
// client functions for full FeaturedContent ./

// client functions for single entry of FeaturedContent /.
export async function addNewFeaturedContentEntry(handle, newContent) {
  const endpoint = `${baseURL}/api/v2/featuredContent/content?handle=${handle}`

  return await apiHandler(endpoint, "POST", newContent)
}

export async function updateFeaturedContentEntry(handle, updatedData) {
  const endpoint = `${baseURL}/api/v2/featuredContent/content/update?handle=${handle}`

  return await apiHandler(endpoint, "PUT", updatedData)
}

export async function deleteFeaturedContentEntry(handle, frontendId) {
  const endpoint = `${baseURL}/api/v2/featuredContent/content/delete?handle=${handle}&frontendId=${frontendId}`

  return await apiHandler(endpoint, "DELETE")
}
// client functions for single entry of FeaturedContent ./
