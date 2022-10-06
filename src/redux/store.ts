import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slicers/modal'
import authenticationReducer from './slicers/authentication'
import contactsReducer from './slicers/contacts'
import globalSlicer from './slicers/global'


export const store = configureStore({
  reducer: {
    modal: modalReducer,
    authentication: authenticationReducer,
    contacts: contactsReducer,
    global:globalSlicer
  }
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch