import { createSlice } from '@reduxjs/toolkit';

const darkLightModeName = 'darkLightMode'

type InitialState = {
    darkLightMode: string
}

const initialState: InitialState = {
    darkLightMode: localStorage.getItem(darkLightModeName) || "bgLight"
}

const globalSlicer = createSlice({
    name: 'global',
    initialState: initialState,
    reducers: {
        darkLightModeToggle(state) {
            const darkLightMode = state.darkLightMode === 'bgLight' ? 'bgDark' : "bgLight";
            state.darkLightMode = darkLightMode;
            localStorage.setItem(darkLightModeName, darkLightMode);
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove('bgLight');
            body.classList.remove('bgDark');
            body.classList.add(darkLightMode);
        }
    }

});

export const { darkLightModeToggle } = globalSlicer.actions

export default globalSlicer.reducer