import { createSlice } from "@reduxjs/toolkit"

const initialState = { id: 0, about: "Loading..." }

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    setAbout: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setAbout } = aboutSlice.actions
export default aboutSlice.reducer
