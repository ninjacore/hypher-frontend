import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { profileDataClient } from "@/lib/utils/profileDataClient"

const initialState = {
  featuredContent: [],
  status: "idle",
  error: null,
}

export const fetchFeaturedContent = createAsyncThunk(
  "featuredContent/fetchFeaturedContent",
  async (handle) => {
    // featuredContent box is at position 0
    const response = await profileDataClient(handle, 0, "GET")
    return response.data
  }
)
