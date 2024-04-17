import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { profileDataClient } from "@/lib/utils/profileDataClient"

const initialState = {
  links: [],
  status: "idle",
  error: null,
}

// client interactions /.
export const fetchLinkCollection = createAsyncThunk(
  "linkCollection/fetchLinkCollection",
  async (handle) => {
    // linkCollection box is at position 0
    const response = await profileDataClient(handle, null, 0, "GET")
    console.log("got something!! --> ", response.data)
    return response.data
  }
)

export const addNewLink = createAsyncThunk(
  "linkCollection/addNewLink",
  async (newLinkItem) => {
    const response = await profileDataClient(newLinkItem.handle, 0, "POST", {
      url: newLinkItem.url,
      text: newLinkItem.text,
      position: newLinkItem.position,
    })
    return response.data
  }
)

export const updateLink = createAsyncThunk(
  "linkCollection/updateLink",
  async (updatedLinkItem) => {
    const response = await profileDataClient(updatedLinkItem.handle, 0, "PUT", {
      url: updatedLinkItem.url,
      text: updatedLinkItem.text,
      position: updatedLinkItem.position,
    })
    return response.data
  }
)

export const deleteLink = createAsyncThunk(
  "linkCollection/deleteLink",
  async (handle, linkPosition) => {
    const response = await profileDataClient(handle, linkPosition, 0, "DELETE")
    return response.data
  }
)
// client interactions ./

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
      .addCase(addNewLink.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.links = state.links.concat(action.payload)
      })
      .addCase(updateLink.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.links = state.links.concat(action.payload)
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.links = state.links.filter(
          (link) => link.position !== action.payload.position
        )
      })
  },
})

export default linkCollectionSlice.reducer

// // for these selectors 'state' is the root Redux state object
// export const selectAllLinks = (state) => state.linkCollection.links
// export const selectLinkById = (state, linkId) =>
//   state.linkCollection.links.find((link) => link.id === linkId)
