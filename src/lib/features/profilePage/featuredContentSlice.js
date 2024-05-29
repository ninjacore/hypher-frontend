import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getFeaturedContent,
  updateFeaturedContent,
  addNewFeaturedContentEntry,
  updateFeaturedContentEntry,
  deleteFeaturedContentEntry,
} from "@/lib/utils/profileDataClients/featuredContentClient"
import { announce } from "@/lib/utils/debugTools/announce"

const initialState = {
  contentList: [],
  status: "idle",
  error: null,
}

const featuredContentSlice = createSlice({
  name: "featuredContent",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch
      .addCase(fetchFeaturedContent.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchFeaturedContent.fulfilled, (state, action) => {
        state.status = "succeeded"
        // Add any fetched posts to the array
        state.contentList = state.contentList.concat(action.payload)
      })
      .addCase(fetchFeaturedContent.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      // Update
      .addCase(updateFeaturedContentEntries.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateFeaturedContentEntries.fulfilled, (state, action) => {
        state.status = "succeeded"

        // replace state.contentList with the updated content
        state.contentList = state.contentList = action.payload
      })

      // Add
      .addCase(addNewFeaturedContent.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addNewFeaturedContent.fulfilled, (state, action) => {
        state.status = "succeeded"
        let newContent = action.payload
        state.contentList = state.contentList.concat(newContent)
      })
      // Update
      .addCase(updateSingleContentEntry.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateSingleContentEntry.fulfilled, (state, action) => {
        state.status = "succeeded"

        announce(
          "action.payload witihin updateSingleContentEntry case (slice) ",
          action.payload
        )

        // update the contentList with the updated content
        let updatedContent = action.payload
        const existingContentIndex = state.contentList.findIndex(
          (content) => content.frontendId === updatedContent.frontendId
        )
        state.contentList[existingContentIndex] = updatedContent
      })
      .addCase(updateSingleContentEntry.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })

      // Delete
      .addCase(deleteSingleContentEntry.pending, (state) => {
        state.status = "loading"
      })
      .addCase(deleteSingleContentEntry.fulfilled, (state, action) => {
        state.status = "succeeded"

        state.contentList = state.contentList.filter(
          (content) => content.frontendId !== action.payload.frontendId
        )
      })
      .addCase(deleteSingleContentEntry.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
  },
})

// client interactions /.
export const fetchFeaturedContent = createAsyncThunk(
  "featuredContent/fetchFeaturedContent",
  async (handle) => {
    // featuredContent box is at position 1
    const response = await getFeaturedContent(handle)
    console.log("got something for featuredContent!! --> ", response.data)

    return response.data
  }
)

export const updateFeaturedContentEntries = createAsyncThunk(
  "featuredContent/updateFeaturedContentEntries",
  async (contentUpdateData) => {
    const response = await updateFeaturedContent(
      contentUpdateData.handle,
      contentUpdateData.content
    )
    return response.data
  }
)

export const addNewFeaturedContent = createAsyncThunk(
  "featuredContent/addNewFeaturedContent",
  async (contentUpdateData) => {
    const { handle, content } = contentUpdateData
    const response = await addNewFeaturedContentEntry(handle, content)
    return response.data
  }
)

// TODO: check if right data-tree
export const updateSingleContentEntry = createAsyncThunk(
  "featuredContent/updateSingleContentEntry",
  async (contentUpdateData) => {
    const response = await updateFeaturedContentEntry(
      contentUpdateData.handle,
      {
        title: contentUpdateData.content.title,
        description: contentUpdateData.content.description,
        url: contentUpdateData.content.url,
        position: contentUpdateData.content.position,
        category: contentUpdateData.content.category,
        frontendId: contentUpdateData.content.frontendId,
      }
    )
    return response.data
  }
)

export const deleteSingleContentEntry = createAsyncThunk(
  "featuredContent/deleteSingleContentEntry",
  async (deletionData) => {
    const { handle, frontendId } = deletionData
    const response = await deleteFeaturedContentEntry(handle, frontendId)
    return response.data
  }
)

// client interactions ./

export default featuredContentSlice.reducer
