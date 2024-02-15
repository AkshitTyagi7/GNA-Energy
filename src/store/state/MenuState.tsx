import { createSlice } from "@reduxjs/toolkit";

interface MenuState {
    isActive: boolean;
}

const initialState: MenuState = {
    isActive: true,
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        toggleMenu: (state: MenuState) => {
            state.isActive = !state.isActive;
        },
    },
});

export const { toggleMenu } = menuSlice.actions;

export default menuSlice.reducer;