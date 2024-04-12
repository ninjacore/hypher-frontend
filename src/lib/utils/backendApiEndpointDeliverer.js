export function backendApiEndpointDeliverer(
  descriptiveEndpointName,
  method,
  handle = null
) {
  let endpoint
  let handleNeeded = false

  switch (method + descriptiveEndpointName) {
    case "GETprofilePageData":
      handleNeeded = true
      endpoint = `http://localhost:5678/api/v1/profilePage/${handle}`
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
