import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { getFeaturedContent } from "@/lib/utils/profileDataClients/featuredContentClient"

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
// client interactions ./

export default featuredContentSlice.reducer
