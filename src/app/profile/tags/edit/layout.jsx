export default function Layout({ children }) {
  let valley = "value"
  return (
    <div className="bg-indigo-900">
      <p>{valley}</p>
      {children}
    </div>
  )
}
