import { ExchangeData } from "../../../pages/Dashboard/Exchange3/FormatData"
import { EXCHANGE_DEMO_DATA } from "./DemoData";


export interface MarketSnapshotData{
    date: string,
    exchange__name: string, 
    product__name: string, 
    time_slot: number,
    purchase_bid_mw: number,
    sell_bid_mw: number,
    mcv_mw: number,
    mcp_rs_mwh: number,
    wt_mcp_rs_mwh: number
}

export interface ExchangeState{

    Exchange: {
        data:{
    date: string,
    exchange__name: string, 
    product__name: string, 
    time_slot: number,
    purchase_bid_mw: number,
    sell_bid_mw: number,
    mcv_mw: number,
    mcp_rs_mwh: number,
    wt_mcp_rs_mwh: number
    }[],
    comparisonRawData: {date_range:{start_date:string, end_date:string}, data:any}[];
    selectedExchange: number;
    selectedProduct: number;
    selectedRegion: string[];
};

page: number;
}

export interface ExchangeStateData{
    iex: ExchangeData;
    hpx: ExchangeData;
    pxil: ExchangeData;
}

// Sort by date and in each date sort by time slot
export const initialExchangeState: ExchangeState = {
    Exchange: {
        // data:EXCHANGE_DEMO_DATA.sort(
        //     // sort by data and in each date sort by time slot
        //     (a, b) => {
        //         if(a.date < b.date){
        //             return -1;
        //         }
        //         if(a.date > b.date){
        //             return 1;
        //         }
        //         return a.time_slot - b.time_slot;
        //     }
        // ).map((item, index)=>{
        //     return {
        //         date: item.date,
        //         exchange__name: item.exchange__name,
        //         product__name: item.product__name,
        //         time_slot: item.time_slot,
        //         purchase_bid_mw: item.purchase_bid_mw,
        //         sell_bid_mw: item.sell_bid_mw,
        //         mcv_mw: item.mcv_mw,
        //         mcp_rs_mwh: item.mcp_rs_mwh,
        //         wt_mcp_rs_mwh: item.wt_mcp_rs_mwh/1000
        //     }
        // }),
        data: [],
        
            comparisonRawData: [],
        selectedExchange:0,
        selectedProduct: 0,
        selectedRegion: [],

    }
    ,
    page: 0
}