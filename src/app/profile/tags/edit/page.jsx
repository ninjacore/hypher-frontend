export default function Page() {
  return (
    <div>
      <TagEditor />
    </div>
  )
}

export function TagEditor({ children }) {
  return (
    <>
      <h2>Your Favorite Tags</h2>
      <ul>
        <li>tag 1</li>
        <li>tag 2</li>
        <li>...</li>
      </ul>
    </>
  )
}
