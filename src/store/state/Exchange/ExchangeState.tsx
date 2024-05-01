// createAsyncThunk to fetch data from API

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { buildHttpReq } from "../../../common";
import { ExchangeState, initialExchangeState } from "./interface";
import { AsyncThunkFulfilledActionCreator, AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { FormatExchangeData } from "../../../pages/Dashboard/Exchange3/FormatData";

const fetchExchangeData = createAsyncThunk(
    "exchange/fetchExchangeData",
    async({start_date, end_date} : {start_date: string, end_date: string})=>{
        console.log("---------- yooo yoo yo")
        try {
            console.log("------")
            let apiRes = await buildHttpReq({
                endpoint: "/all_exchange_analytics_api_range",
                body: {
                    start_date: start_date,
                    end_date: end_date,
                },
                method: "POST",
            });
            console.log(
                {
                    iex: FormatExchangeData(apiRes.iex),
                    hpx: FormatExchangeData(apiRes.hpx),
                    pxil: FormatExchangeData(apiRes.pxil,true)
                
                }
            );
            return {
                iex: FormatExchangeData(apiRes.iex),
                hpx: FormatExchangeData(apiRes.hpx),
                pxil: FormatExchangeData(apiRes.pxil,true)
            
            };
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
