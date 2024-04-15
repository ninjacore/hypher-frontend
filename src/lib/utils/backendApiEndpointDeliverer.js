export function backendApiEndpointDeliverer(
  descriptiveEndpointName,
  method,
  handle = null
) {
  let baseURL = "http://localhost:5678"

  let endpoint
  let handleNeeded = false

  switch (method + descriptiveEndpointName) {
    case "GETprofilePageData":
      handleNeeded = true
      endpoint = `${baseURL}/api/v1/profilePage/${handle}`
      break

    case "GETmainProfilePageData":
      handleNeeded = true
      endpoint = `${baseURL}/api/v1/profiles/handle/${handle}`
      break

    case "GETfeaturedContent":
      handleNeeded = true
      endpoint = `${baseURL}/api/v1/featuredContent?handle=${handle}`
      break

    default:
      break
  }

  if (!endpoint) {
    throw new Error("No endpoint found")
  }

  if (handleNeeded && !handle) {
    throw new Error("Handle of target profile needed for this endpoint")
  }

  return endpoint
}
