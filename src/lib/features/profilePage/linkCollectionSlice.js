import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { profileDataClient } from "@/lib/utils/profileDataClient"

const initialState = {
  links: [],
  status: "idle",
  error: null,
}

export const fetchLinkCollection = createAsyncThunk(
  "linkCollection/fetchLinkCollection",
  async (handle) => {
    // linkCollection box is at position 1
    const response = await await profileDataClient(handle, 1, "GET")
    console.log("got something!! --> ", response.data)
    return response.data
  }
)

const linkCollectionSlice = createSlice({
  name: "linkCollection",
  initialState,
  reducers: {},
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
    //   .addCase(addNewLink.fulfilled, (state, action) => {
    //     state.links.push(action.payload)
    //   })
  },
})

// DRAFT CODE BELOW..

// export const addNewLink = createAsyncThunk(
//   "linkCollection/addNewLink",
//   async (newLinkItem) => {
//     const response = await putClient(
//       `http://localhost:5678/api/v1/linkCollections/byHandle/${newLinkItem.handle}?contentBoxPosition=${newLinkItem.position}`,
//       {
//         body: JSON.stringify({
//           url: newLinkItem.url,
//           text: newLinkItem.text,
//         }),
//         method: "PUT",
//       }
//     )
//     return response.data
//   }
// )
// // draft code - real reducers will probably handle full collection updates
// const linkCollectionSlice = createSlice({
//   name: "linkCollection",
//   initialState,
//   reducers: {
//     // example if payload not known to component
//     addLink: {
//       reducer(state, action) {
//         state.links.push(action.payload)
//       },
//       prepare(url, text, contentBoxPosition, handle) {
//         return {
//           payload: {
//             id: nanoid(),
//             text,
//             url,
//             contentBoxPosition,
//             handle,
//           },
//         }
//       },
//     },
//     // default style of reducer
//     removeLink: (state, action) => {
//       state.links = state.links.filter((link) => link.id !== action.payload)
//     },
//     updateLink: (state, action) => {
//       const { id, text, url, position } = action.payload
//       const link = state.links.find((link) => link.id === id)
//       if (link) {
//         link.text = text
//         link.url = url
//         link.position = position
//       }
//     },
//   },
//   extraReducers(builder) {
//     builder
//       .addCase(fetchLinkCollection.pending, (state) => {
//         state.status = "loading"
//       })
//       .addCase(fetchLinkCollection.fulfilled, (state, action) => {
//         state.status = "succeeded"
//         // Add any fetched posts to the array
//         state.links = state.links.concat(action.payload)
//       })
//       .addCase(fetchLinkCollection.rejected, (state, action) => {
//         state.status = "failed"
//         state.error = action.error.message
//       })
//       .addCase(addNewLink.fulfilled, (state, action) => {
//         state.links.push(action.payload)
//       })
//   },
// })

// export const { addLink, removeLink, updateLink } = linkCollectionSlice.actions
export default linkCollectionSlice.reducer

// // for these selectors 'state' is the root Redux state object
// export const selectAllLinks = (state) => state.linkCollection.links
// export const selectLinkById = (state, linkId) =>
//   state.linkCollection.links.find((link) => link.id === linkId)
