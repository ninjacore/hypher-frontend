import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  links: [
    { id: 0, text: "GitHub", url: "https://github.com", position: 0 },
    { id: 1, text: "LinkedIn", url: "https://linkedin.com", position: 1 },
    { id: 2, text: "Twitter", url: "https://twitter.com", position: 2 },
    { id: 3, text: "Instagram", url: "https://instagram.com", position: 3 },
  ],
}

// draft code - real reducers will probably handle full collection updates
const linkCollectionSlice = createSlice({
  name: "linkCollection",
  initialState,
  reducers: {
    // example if payload not known to component
    addLink: {
      reducer(state, action) {
        state.links.push(action.payload)
      },
      prepare(text, url, position) {
        return {
          payload: {
            id: nanoid(),
            text,
            url,
            position,
          },
        }
      },
    },
    // default style of reducer
    removeLink: (state, action) => {
      state.links = state.links.filter((link) => link.id !== action.payload)
    },
    updateLink: (state, action) => {
      const { id, text, url, position } = action.payload
      const link = state.links.find((link) => link.id === id)
      if (link) {
        link.text = text
        link.url = url
        link.position = position
      }
    },
  },
})

export const { addLink, removeLink, updateLink } = linkCollectionSlice.actions
export default linkCollectionSlice.reducer
