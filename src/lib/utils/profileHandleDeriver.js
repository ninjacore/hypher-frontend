export function deriveProfileHandle(pathname) {
  let handle

  let pathWithoutBaseURL = pathname.split("/").pop()

  // case: profile page
  if (!pathWithoutBaseURL.includes("/")) {
    handle = pathWithoutBaseURL
    return handle
  }

  // if case not covered..
  throw new Error("Handle not found in URL")
}
