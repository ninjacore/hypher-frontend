import { announce } from "../debugTools/announce"
import { apiHandler } from "../apiHandler"

const baseURL = "http://localhost:5678"

// client functions for FeaturedContent /.
export async function getFeaturedContent(handle) {
  //   const endpoint = `${baseURL}/api/v1/featuredContent?handle=${handle}&contentBoxPosition=${contentBoxPosition}`
  const endpoint = `${baseURL}/api/v2/featuredContent?handle=${handle}`

  return await apiHandler(endpoint, "GET")
}

export async function updateFeaturedContent(handle, dataUpdates) {
  const endpoint = `${baseURL}/api/v2/featuredContent/update?handle=${handle}`

  return await apiHandler(endpoint, "PUT", dataUpdates)
}

export async function updateFeaturedContentEntry(handle, updatedData) {
  const endpoint = `${baseURL}/api/v2/featuredContent/content/update?handle=${handle}`

  return await apiHandler(endpoint, "PUT", updatedData)
}
// client functions for FeaturedContent ./
