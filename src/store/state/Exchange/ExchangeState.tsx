// createAsyncThunk to fetch data from API

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildHttpReq } from "../../../common";
import { ExchangeState, initialExchangeState } from "./interface";
import { AsyncThunkFulfilledActionCreator, AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { FormatExchangeData } from "../../../pages/Dashboard/Exchange3/FormatData";



const fetchExchangeData = createAsyncThunk(
    "exchange/fetchExchangeData",
    async({start_date, end_date} : {start_date: string, end_date: string})=>{

        // date is in format dd-mm-yyyy convert it to yyyy-mm-dd
        start_date = start_date.split("-").reverse().join("-");
        end_date = end_date.split("-").reverse().join("-");
        try {
            let req =await fetch(`https://api-data.gna.energy/data/getData?start_date=${start_date}&end_date=${end_date}`, {
                method: "GET",
                headers: {
                },
            });
            let apiRes = await req.json();
            console.log("API Response:", apiRes);
            return apiRes.data.sort(
                (a: any, b: any) => {
                    if(a.date < b.date){
                        return -1;
                    }
                    if(a.date > b.date){
                        return 1;
                    }
                    return a.time_slot - b.time_slot;
                }
            
            ).map((item: any, index: any)=>{
                return {
                    date: item.date,
                    exchange__name: item.exchange__name,
                    product__name: item.product__name,
                    time_slot: item.time_slot,
                    purchase_bid_mw: item.purchase_bid_mw,
                    sell_bid_mw: item.sell_bid_mw,
                    mcv_mw: item.mcv_mw,
                    mcp_rs_mwh: item.mcp_rs_mwh,
                    wt_mcp_rs_mwh: item.wt_mcp_rs_mwh/1000
                }
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            return error;
        }
    }
);


const exchangeSlice = createSlice({
    name: "exchange",
    initialState: initialExchangeState,
    reducers: {
        setSelectedExchange: (state: { Exchange: { selectedExchange: number; }; }, action: PayloadAction<number>)=>{
            state.Exchange.selectedExchange = action.payload;
        },
        setSelectedProduct: (state: { Exchange: { selectedProduct: number; }; }, action: PayloadAction<number>)=>{
            state.Exchange.selectedProduct = action.payload;
        },

        setExchangePage: (state: { page: number; }, action: PayloadAction<number>)=>{
            state.page = action.payload;
        },
         setComparisonRawData: (state: { Exchange: { comparisonRawData: any; }; }, action: PayloadAction<any>)=>{
            state.Exchange.comparisonRawData = action.payload;
        }
    },
    extraReducers: (builder: { addCase: (arg0: AsyncThunkFulfilledActionCreator<any, { start_date: string; end_date: string; }, AsyncThunkConfig>, arg1: (state: any, action: any) => void) => void; })=>{
        builder.addCase(fetchExchangeData.fulfilled, (state :  ExchangeState, action)=>{
            console.log("Exchange Data:", action.payload);
            state.Exchange.data = action.payload;
        });
    }
});

export default exchangeSlice.reducer;
export const { setSelectedExchange,setComparisonRawData, setSelectedProduct,setExchangePage } = exchangeSlice.actions;
export { fetchExchangeData };
