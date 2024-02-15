import { configureStore } from "@reduxjs/toolkit";
import MenuState from "./state/MenuState";

export const store = configureStore({
    reducer:{
      menu: MenuState,
    }
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


  