import { configureStore } from "@reduxjs/toolkit";
import MenuState from "./state/MenuState";
import BuyerSellerFilterSlice from "./state/ExchangeState";
export const store = configureStore({
    reducer:{
      menu: MenuState,
      buyerSeller: BuyerSellerFilterSlice,
    }
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


  