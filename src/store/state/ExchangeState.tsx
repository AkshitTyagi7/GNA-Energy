import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface subfilter {
    id: number;
    name: string;
  }
  
  export interface BuyerSellerFilter {
    id: number;
    name: string;
    filters: subfilter[];
  }

  export const BuyerSellerFilters : BuyerSellerFilter[] = [
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
            {id: 5, name: "NERLDC" },
        ],
        
    }
  ];

interface ChartElement{
    name: string;
    value: number;
}
export interface BuyerSeller {
    filters:BuyerSellerFilter[],
    Data : {
        buyer: ChartElement[];
        seller: ChartElement[];
    }
}

const initialState: BuyerSeller = {
    filters: BuyerSellerFilters,
    Data : {
        buyer: [],
        seller: [],
    }
};

 const BuyerSellerFilterSlice = createSlice({
    name: "BuyerSellerFilters",
    initialState,
    reducers: {
        AddBuyerSellerFilter: (state: BuyerSeller, action: PayloadAction<{index: number, filter: subfilter}>)  => {
            state.filters[action.payload.index].filters.push(action.payload.filter);     
        },
        RemoveBuyerSellerFilter: (state: BuyerSeller, action: PayloadAction<{index: number, filter: subfilter}>) => {
            state.filters[action.payload.index].filters = state.filters[action.payload.index].filters.filter((filter) => filter.id !== action.payload.filter.id);
            },
        setBuyerSellerData: (state: BuyerSeller, action: PayloadAction<BuyerSeller>) => {
            state.Data = action.payload.Data;
        },

        
    },
});

export const { AddBuyerSellerFilter, RemoveBuyerSellerFilter, setBuyerSellerData } = BuyerSellerFilterSlice.actions;
export default BuyerSellerFilterSlice.reducer;