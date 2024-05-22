export async function apiHandler(endpoint, method, body = null) {
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
