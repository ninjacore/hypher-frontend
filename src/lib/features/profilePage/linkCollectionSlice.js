import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { profileDataClient } from "@/lib/utils/profileDataClients/profileDataClient"
import { linkCollectionClient } from "@/lib/utils/profileDataClients/linkCollectionClient"

const initialState = {
  links: [],
  status: "idle",
  error: null,
}

// monster client interactions /.
export const fetchLinkCollection = createAsyncThunk(
  "linkCollection/fetchLinkCollection",
  async (handle) => {
    const response = await linkCollectionClient(handle)
    console.log("got something!! --> ", response.data)

    // temp for mobile debugging
    document.getElementById("mobileMessageOutput").innerHTML =
      JSON.stringify(response)

    return response.data
  }
)

// TODO: save full link
export const updateLinkCollection = createAsyncThunk(
  "linkCollection/updateLinkCollection",
  async (handle, links) => {
    const response = await linkCollectionClient(
      handle,
      "linkCollection",
      "PUT",
      links
    )
    return response.data
  }
)

export const addNewLink = createAsyncThunk(
  "linkCollection/addNewLink",
  async (handle, newLinkItem) => {
    // async (newLinkItem) => {
    // const response = await profileDataClient(newLinkItem.handle, 0, "POST", {
    //   url: newLinkItem.url,
    //   text: newLinkItem.text,
    //   position: newLinkItem.position,
    // })
    const response = await linkCollectionClient(
      handle,
      "link",
      "POST",
      newLinkItem
    )
    return response.data
  }
)

export const updateLink = createAsyncThunk(
  "linkCollection/updateLink",
  async (handle, updatedLinkItem) => {
    // const response = await profileDataClient(updatedLinkItem.handle, 0, "PUT", {
    const response = await linkCollectionClient(
      updatedLinkItem.handle,
      0,
      "PUT",
      {
        url: updatedLinkItem.url,
        text: updatedLinkItem.text,
        position: updatedLinkItem.position,
      }
    )
    return response.data
  }
)

export const deleteLink = createAsyncThunk(
  "linkCollection/deleteLink",
  async (handle, linkPosition) => {
    // const response = await profileDataClient(handle, linkPosition, 0, "DELETE")
    const response = await linkCollectionClient(
      handle,
      "link",
      "DELETE",
      null,
      linkPosition
    )
    return response.data
  }
)
// monster client interactions ./

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
      .addCase(updateLinkCollection.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateLinkCollection.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.links = state.links.concat(action.payload)
      })
      .addCase(updateLinkCollection.rejected, (state, action) => {
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
