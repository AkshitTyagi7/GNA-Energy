// async function fetchVolumeData({
//     selectedExchange,
//     selectedMarket,
//     selectedProduct,
//     startMonth,
//     endMonth,
//   }: {
//     selectedExchange: Filter[];
//     selectedMarket: Filter[];
//     selectedProduct: Product[];
//     startMonth: { value: number; label: string };
//     endMonth: { value: number; label: string };
//   }) {
//     const res = await buildHttpReq({
//       endpoint: "market_monitoring_volume_api",
//       method: "POST",
//       body: {
//         exchange: selectedExchange.map((item) => item.name).toString(),
//         market: selectedMarket.map((item) => item.name).toString(),
//         product: selectedProduct.map((item) => item.name).toString(),
//         start_month: startMonth.label,
//         end_month: endMonth.label,
//       },
//     });

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildHttpReq } from "../../../common";
import { Filter, Product } from "./types";

//     setProductData(FormatMarketMonitoringData(res));

//     tabIndex == 0 && setChartData(FormatMarketMonitoringData(res));
//   }
const fetchExchangeData = createAsyncThunk(
    "exchange/fetchExchangeData",
    async(
        {selectedExchange, selectedMarket, selectedProduct, startMonth, endMonth} :{
            selectedExchange: Filter[];
            selectedMarket: Filter[];
            selectedProduct: Product[];
            startMonth: { value: number; label: string };
            endMonth: { value: number; label: string };
        }
    )=>{
        const res = await buildHttpReq({
            endpoint: "market_monitoring_volume_api",
            method: "POST",
            body: {
                exchange: selectedExchange.map((item) => item.name).toString(),
                market: selectedMarket.map((item) => item.name).toString(),
                product: selectedProduct.map((item) => item.name).toString(),
                start_month: startMonth.label,
                end_month: endMonth.label,
            },
        });
        return res;

    }
);

const initialMarketMonitoringState = {
    tabIndex: 0,
    volume: [],
    productData: [],
    page: 0,
};

const marketMonitoringSlice = createSlice({
    name: "marketMonitoring",
    initialState: initialMarketMonitoringState,
    reducers:{
        setTabIndex: (state, action)=>{
            state.tabIndex = action.payload;
        },
        setVolumeData: (state, action)=>{
            state.volume = action.payload;
        },
        setProductData: (state, action)=>{
            state.productData = action.payload;
        },
        setPage: (state, action)=>{
            state.page = action.payload;
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchExchangeData.fulfilled, (state, action)=>{
            state.productData = action.payload;
            
        });
    }
});

export default marketMonitoringSlice.reducer;
export const {setTabIndex, setVolumeData, setProductData, setPage} = marketMonitoringSlice.actions;