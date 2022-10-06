import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Types = {
  isVisible: boolean
  formName: string
  title?: string
}
const initialState: Types = {
  isVisible: false,
  formName: '',
  title: ""
}
const modalSlicer = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    showModal(state, action: PayloadAction<{ formName: string, title?: string }>) {
      state.isVisible = true;
      state.formName = action.payload.formName;
      state.title = action.payload.title;
    },
    hideModal(state) {
      state.isVisible = false
    }
  }
})


export const { showModal, hideModal } = modalSlicer.actions

export default modalSlicer.reducer