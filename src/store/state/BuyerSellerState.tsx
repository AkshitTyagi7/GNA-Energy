import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DemoFilterData } from "./UtilizationData";

export interface subfilter {
  id: number;
  name: string;
}

export interface BuyerSellerFilter {
  id: number;
  name: string;
  filters: subfilter[];
}

export const BuyerSellerFilters: BuyerSellerFilter[] = [
  {
    id: 1,
    name: "Exchange",
    filters: [
      { id: 1, name: "HPX" },
      { id: 2, name: "IEX" },
      { id: 3, name: "PXIL" },
    ],
  },
  {
    id: 2,
    name: "Product",
    filters: [
      { id: 1, name: "DAM" },
      { id: 2, name: "RTM" },
      { id: 3, name: "GDAM" },
      { id: 4, name: "HPDAM" },
    ],
  },
  {
    id: 3,
    name: "Region",
    filters: [
      { id: 1, name: "NRLDC" },
      { id: 2, name: "SRLDC" },
      { id: 3, name: "ERLDC" },
      { id: 4, name: "WRLDC" },
      { id: 5, name: "NERLDC" },
    ],
  },
];

interface ChartElement {
  name: string;
  value: number;
}
interface BuyerSellerData{
  buyer: ChartElement[];
  seller: ChartElement[];
  region_seller: ChartElement[];
  region_buyer: ChartElement[];
};
export interface BuyerSeller {
  filters: BuyerSellerFilter[];
  Data: BuyerSellerData;
};



export interface UtilizationTrendElement {
  name: string;
  [key: string]: string | number;
}
export interface UtilizationTrendMCP{
  date: string;
  wt_mcp: number;
}
export interface UtilizationTrendData{
    buyer: UtilizationTrendElement[];
    seller: UtilizationTrendElement[];
    buyer_selected: ChartElement[];
    seller_selected: ChartElement[];
    mcp: UtilizationTrendMCP[];
  };
export interface UtilizationTrend {
  data: UtilizationTrendData;
  filters:{
    buyer_name: string[];
    seller_name: string[];
  }

}

export interface ExchangeState {
  BuyerSeller: BuyerSeller;
  Trend: UtilizationTrend;
}

const initialState: ExchangeState = {
  
  BuyerSeller:{ filters: BuyerSellerFilters,
  Data: {
    buyer: [],
    seller: [],
    region_seller: [],
    region_buyer: [],
  },},
    // Trend: {
    //     data: {
    //     buyer: [],
    //     seller: [],
    //     buyer_selected: [],
    //     seller_selected: [],
    //     },
    //     filters:{
    //     buyer_name: [],
    //     seller_name: [],
    //     }
    // },
    Trend:{
      data: {
        buyer: [],
        seller: [],
        buyer_selected: [],
        seller_selected: [],
        mcp: [],
      
      },
      filters: DemoFilterData
    }
};

const BuyerSellerFilterSlice = createSlice({
  name: "BuyerSellerFilters",
  initialState,
  reducers: {
    AddBuyerSellerFilter: (
      state: ExchangeState,
      action: PayloadAction<{ index: number; filter: subfilter }>
    ) => {
      state.BuyerSeller.filters[action.payload.index].filters.push(action.payload.filter);
    },
    RemoveBuyerSellerFilter: (
      state: ExchangeState,
      action: PayloadAction<{ index: number; filter: subfilter }>
    ) => {
      state.BuyerSeller.filters[action.payload.index].filters = state.BuyerSeller.filters[
        action.payload.index
      ].filters.filter((filter) => filter.id !== action.payload.filter.id);
    },
    setBuyerSellerData: (
      state: ExchangeState,
      action: PayloadAction<BuyerSellerData>
    ) => {
      state.BuyerSeller.Data = action.payload;
    },
    setTrendFilter: (
      state: ExchangeState,
      action: PayloadAction<{buyer : ChartElement[], seller: ChartElement[]}>
    ) => {
      state.Trend.data.buyer_selected = action.payload.buyer;
      state.Trend.data.seller_selected = action.payload.seller;
    },
    setTrendData: (
      state: ExchangeState,
      action: PayloadAction<UtilizationTrendData>
    ) => {
     
      state.Trend.data = action.payload;
    },
  },
});

export const {
  AddBuyerSellerFilter,
  RemoveBuyerSellerFilter,
  setTrendData,
  setTrendFilter,
  setBuyerSellerData,
} = BuyerSellerFilterSlice.actions;
export default BuyerSellerFilterSlice.reducer;
