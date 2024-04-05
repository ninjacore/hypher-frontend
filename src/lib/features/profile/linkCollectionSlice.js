import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import {
  client,
  linkCollectionDataClient,
} from "@/lib/tempUtils/fetchClients/linkCollectionDataClient"

// const initialState = {
//   links: [
//     { id: 0, text: "GitHub", url: "https://github.com", position: 0 },
//     { id: 1, text: "LinkedIn", url: "https://linkedin.com", position: 1 },
//     { id: 2, text: "Twitter", url: "https://twitter.com", position: 2 },
//     { id: 3, text: "Instagram", url: "https://instagram.com", position: 3 },
//   ],
// }
const initialState = {
  links: [],
  status: "idle",
  error: null,
}

// TODO: use actual fetch client instead of direct call below
// export const fetchLinkCollection = createAsyncThunk(
//   "linkCollection/fetchLinkCollectio",
//   async () => {
//     const response = await linkCollectionDataClient(handle)
//     return response.data
//   }
// )
// POC fetching data from server
export const fetchLinkCollection = createAsyncThunk(
  "linkCollection/fetchLinkCollection",
  async (handle) => {
    // 1st approach -- not working!
    // const response = await fetch(
    //   `http://localhost:5678/api/v1/linkCollections/byHandle/${handle}`
    // )
    // const data = await response.json()
    // return data
    // 2nd approach -- not working!
    // const data = await linkCollectionDataClient(handle)
    // return data
    // 3rd approach..
    const response = await client()
    console.log("got something!! --> ", response.data)
    return response.data
  }
)

export const addNewLink = createAsyncThunk(
  "linkCollection/addNewLink",
  async (newLinkItem) => {
    const response = await client(
      `http://localhost:5678/api/v1/linkCollections/byHandle/${newLinkItem.handle}?contentBoxPosition=${newLinkItem.position}`,
      {
        body: JSON.stringify({
          url: newLinkItem.url,
          text: newLinkItem.text,
        }),
        method: "PUT",
      }
    )
    return response.data

    // const response = await linkCollectionDataClient("dnt.is", 0, "PUT", {
    //   url: "newLinkItem.url",
    //   text: "newLinkItem.text",
    // })
    // return response
  }
)

// draft code - real reducers will probably handle full collection updates
const linkCollectionSlice = createSlice({
  name: "linkCollection",
  initialState,
  reducers: {
    // example if payload not known to component
    addLink: {
      reducer(state, action) {
        state.links.push(action.payload)
      },
      prepare(url, text, contentBoxPosition, handle) {
        return {
          payload: {
            id: nanoid(),
            text,
            url,
            contentBoxPosition,
            handle,
          },
        }
      },
    },
    // default style of reducer
    removeLink: (state, action) => {
      state.links = state.links.filter((link) => link.id !== action.payload)
    },
    updateLink: (state, action) => {
      const { id, text, url, position } = action.payload
      const link = state.links.find((link) => link.id === id)
      if (link) {
        link.text = text
        link.url = url
        link.position = position
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLinkCollection.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchLinkCollection.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Add any fetched posts to the array
        state.links = state.links.concat(action.payload)
      })
      .addCase(fetchLinkCollection.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(addNewLink.fulfilled, (state, action) => {
        state.links.push(action.payload)
      })
  },
})

export const { addLink, removeLink, updateLink } = linkCollectionSlice.actions
export default linkCollectionSlice.reducer

// for these selectors 'state' is the root Redux state object
export const selectAllLinks = (state) => state.linkCollection.links
export const selectLinkById = (state, linkId) =>
  state.linkCollection.links.find((link) => link.id === linkId)
