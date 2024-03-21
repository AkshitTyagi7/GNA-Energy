import { configureStore } from "@reduxjs/toolkit";
import MenuState from "./state/MenuState";
import BuyerSellerFilterSlice from "./state/BuyerSellerState";
import DocumentSlice from "./state/DocumentState";
import ExchangeState from "./state/Exchange/ExchangeState";
// TODO Presist Reducer
export const store = configureStore({
    reducer:{
      menu: MenuState,
      buyerSeller: BuyerSellerFilterSlice,
      exchange: ExchangeState,

      document: DocumentSlice 
    }
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


  