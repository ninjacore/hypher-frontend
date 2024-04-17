import { createSlice } from "@reduxjs/toolkit"

// for data fetch
import { nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { profileDataClient } from "@/lib/utils/profileDataClient"

const initialState = {
  mainProfilePageData: [],
  status: "idle",
  error: null,
}

export const fetchMainProfilePageData = createAsyncThunk(
  "mainProfilePage/fetchMainProfilePageData",
  async (handle) => {
    const response = await profileDataClient(handle, 0, "GET")
    return response.data
  }
)

const mainSlice = createSlice({
  name: "mainProfilePageData",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchMainProfilePageData.pending]: (state, action) => {
      state.status = "loading"
    },
    [fetchMainProfilePageData.fulfilled]: (state, action) => {
      state.status = "succeeded"
      state.mainProfilePageData = state.mainProfilePageData.concat(
        action.payload
      )
    },
    [fetchMainProfilePageData.rejected]: (state, action) => {
      state.status = "failed"
      state.error = action.error.message
    },
  },
})
