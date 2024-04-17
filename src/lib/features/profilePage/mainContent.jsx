"use client"

// to read data from the Redux store
import { useSelector } from "react-redux"

// specific READ actions for this feature
import { fetchMainProfilePageData } from "./mainSlice"

// to save data to the Redux store
// tbd..

export const MainContent = () => {
  // useSelector is a hook that allows you to extract data from the Redux store state
  const dispatch = useDispatch()
  const mainProfilePageData = useSelector(
    (state) => state.mainProfilePageData.mainProfilePageData
  )
  // TODO: split into name, about and tags

  const mainProfilePageDataStatus = useSelector(
    (state) => state.mainProfilePageData.status
  )

  useEffect(() => {
    if (mainProfilePageDataStatus === "idle") {
      dispatch(fetchMainProfilePageData("dnt.is"))
    }
  }, [mainProfilePageDataStatus, dispatch])

  // // to not cause 'too many rerenders' error
  // const renderedLinkCollection = links.map((link) => {
  return (
    <div>
      {mainProfilePageData.map((item) => (
        <div key={item.id}>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}
