import { configureStore } from "@reduxjs/toolkit";
import MenuState from "./state/MenuState";
import BuyerSellerFilterSlice from "./state/ExchangeState";
import DocumentSlice from "./state/DocumentState";
export const store = configureStore({
    reducer:{
      menu: MenuState,
      buyerSeller: BuyerSellerFilterSlice,

      document: DocumentSlice 
    }
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


  