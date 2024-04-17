export function deriveProfileHandle(pathname) {
  let handle

  // let pathWithoutBaseURL =

  // case: profile page
  if (!pathname.includes("/")) {
    handle = pathname.split("/").pop()
    return handle
  }

  // if case not covered..
  throw new Error("Handle not found in URL")
}
