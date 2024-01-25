import { ProfileProvider, ProfileContext } from "./ProfileProvider"

export default function Page({ children }) {
  return <ProfileProvider>{children}</ProfileProvider>
}
