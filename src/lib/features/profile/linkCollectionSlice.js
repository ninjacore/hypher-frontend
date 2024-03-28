import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  links: [
    { id: 0, name: "GitHub", url: "https://github.com", position: 0 },
    { id: 1, name: "LinkedIn", url: "https://linkedin.com", position: 1 },
    { id: 2, name: "Twitter", url: "https://twitter.com", position: 2 },
    { id: 3, name: "Instagram", url: "https://instagram.com", position: 3 },
  ],
}

// draft code - real reducers will probably handle full collection updates
const linkCollectionSlice = createSlice({
  name: "linkCollection",
  initialState,
  reducers: {
    addLink: (state, action) => {
      state.links.push(action.payload)
    },
    removeLink: (state, action) => {
      state.links = state.links.filter((link) => link.id !== action.payload)
    },
    updateLink: (state, action) => {
      const { id, name, url, position } = action.payload
      const link = state.links.find((link) => link.id === id)
      if (link) {
        link.name = name
        link.url = url
        link.position = position
      }
    },
  },
})

export const { addLink, removeLink, updateLink } = linkCollectionSlice.actions
export default linkCollectionSlice.reducer
