# Frontend App

Build with Next.js

## Setup

To get started run the following command:

```shell
npm install
```

To run the app in development mode:

```shell
npm run dev
```

To build a deployable app:

```shell
npm run build
```

## Developer Notes

### Environment Variables

TODO: once available

### State Management

TODO: explain what's managed by React Context API (ProfilePage: handle, linkCollectionIsSortable, setLinkCollectionIsSortable)

TODO: explain what's managed by Redux (linkCollection)

### Used Libraries

In `store.ts` the `configureStore` from the Redux Toolkit is used. What's interesting about that: _"`configureStore` automatically adds several middleware to the store setup by default to provide a good developer experience, and also sets up the store so that the Redux DevTools Extension can inspect its contents." ~ [Redux Basics Part 2](https://redux.js.org/tutorials/essentials/part-2-app-structure)_

More from that source: _"You can only write "mutating" logic in Redux Toolkit's `createSlice` and `createReducer` because they use Immer inside! If you write mutating logic in reducers without Immer, it will mutate the state and cause bugs!"_

More guidance from the same source: _"This is also a good example of how to think about forms in Redux in general. Most form state probably shouldn't be kept in Redux. Instead, keep the data in your form components as you're editing it, and then dispatch Redux actions to update the store when the user is done._"
