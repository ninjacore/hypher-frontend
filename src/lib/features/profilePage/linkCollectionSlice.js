import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { profileDataClient } from "@/lib/utils/profileDataClients/profileDataClient"
import { linkCollectionClient } from "@/lib/utils/profileDataClients/linkCollectionClient"
import { announce } from "@/lib/utils/debugTools/announce"

const initialState = {
  links: [],
  status: "idle",
  error: null,
}

// client interactions /.
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

export const updateLinkCollection = createAsyncThunk(
  "linkCollection/updateLinkCollection",
  async (updateData) => {
    const { handle, links } = updateData
    const response = await linkCollectionClient(
      handle,
      "linkCollection",
      "PUT",
      links
    )
    announce("response.data within updateLinkCollection: ", response.data)
    return response.data
  }
)

export const addNewLink = createAsyncThunk(
  "linkCollection/addNewLink",
  async (newLinkData) => {
    const { handle, newLinkItem: newLink } = newLinkData
    const response = await linkCollectionClient(handle, "link", "POST", newLink)
    return response.data
  }
)

export const updateLink = createAsyncThunk(
  "linkCollection/updateLink",
  async (updatedLinkData) => {
    const { handle, updatedLink } = updatedLinkData
    announce("updateData that was dispatched", updatedLinkData)

    const response = await linkCollectionClient(
      handle,
      "link",
      "PUT",
      {
        url: updatedLink.url,
        text: updatedLink.text,
        position: updatedLink.position,
      },
      updatedLink.position
    )
    return response.data
  }
)

export const deleteLink = createAsyncThunk(
  "linkCollection/deleteLink",
  async (deletionData) => {
    const { handle, linkPosition } = deletionData
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

        announce(
          "action.payload within updateLinkCollection case (slice): ",
          action.payload
        )
        // replace the entire link collection with the updated one
        state.links = action.payload
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

        announce(
          "action.payload within updateLink case (slice): ",
          action.payload
        )

        // save updated links
        state.links = action.payload
      })
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.links = state.links.filter(
          (link) => link.position !== action.payload.position
        )
      })
  },
})

export default linkCollectionSlice.reducer
